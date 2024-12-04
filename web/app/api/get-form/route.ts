import * as anchor from '@project-serum/anchor';
import { IDL } from '@/config/anchor/idl';
import { getProgram } from '@/config/anchor/index';
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import { decode, encode } from 'bs58'; // Thêm thư viện mã hóa base58 nếu cần
import { BN } from 'bn.js';
import { Keypair } from '@solana/web3.js';
import { deCompressedContent } from '@/lib/content';

type FormAccount = IdlAccounts<typeof IDL>['form'];

export async function POST(req: Request) {
  try {
    const id = await req.json();
    const program = await getProgram();
    const idBytes = Buffer.from(id);
    const keypairBase58 = process.env.SOLANA_SECRET_KEY as string;
    const keypairBytes = decode(keypairBase58);
    const systemKeypair = Keypair.fromSecretKey(keypairBytes);
    const formAccounts: ProgramAccount<FormAccount>[] =
      await program.account.form.all([
        {
          memcmp: {
            offset: 8 + 4, // Tính toán offset dựa trên các trường trước trường owner
            bytes: encode(idBytes),
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
    const validForms = publishedForms.filter((form) => {
      return (
        (form.remainSol as number) >= (form.solPerUser as number) &&
        (form.solPerUser as number) > 0
      );
    });
    if (validForms.length == 0) {
      return new Response(JSON.stringify('Form not found!'), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }
    const decompressedForm = {
      ...validForms[0],
      content: deCompressedContent(validForms[0].content as string),
    };
    return new Response(JSON.stringify(decompressedForm), {
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
