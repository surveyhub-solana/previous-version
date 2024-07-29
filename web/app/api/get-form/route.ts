import * as anchor from '@project-serum/anchor';
import { IDL } from '@/config/anchor/idl';
import { getProgram } from '@/config/anchor/index';
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import base58 from 'bs58'; // Thêm thư viện mã hóa base58 nếu cần

type FormAccount = IdlAccounts<typeof IDL>['form'];

export async function POST(req: Request) {
  try {
    const id = await req.json();
    const program = await getProgram();
    const idBytes = Buffer.from(id);
    const systemKeypair = getKeypairFromEnvironment('SOLANA_SECRET_KEY');
    const formAccounts: ProgramAccount<FormAccount>[] =
      await program.account.form.all([
        {
          memcmp: {
            offset: 8 + 4, // Tính toán offset dựa trên các trường trước trường owner
            bytes: base58.encode(idBytes),
          },
        },
      ]);
    await program.methods
      .visitForm()
      .accounts({
        form: formAccounts[0].publicKey,
        system: systemKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([systemKeypair])
      .rpc();
    const publishedForms = formAccounts
      .map((account) => account.account)
      .filter((form) => form.published);
    console.log(publishedForms);
    const validForms = publishedForms.filter((form) => {
      const remainSol = Number(new BN(form.remainSol as number, 16));
      const solPerUser = Number(new BN(form.solPerUser as number, 16));
      return remainSol >= solPerUser && solPerUser > 0;
    });
    if (validForms.length == 0) {
      return new Response(JSON.stringify('Form not found!'), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }
    return new Response(JSON.stringify(validForms[0]), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error form:', error);

    if (error instanceof Error) {
      console.error('Error form:', error.message);
      return new Response(
        JSON.stringify({
          message: 'Internal server error',
          error: error.message,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 500,
        }
      );
    }
    console.error('Unknown error get form:', error);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
        error: 'Unknown error',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
}
