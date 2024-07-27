import { IDL } from '@/config/anchor/idl';
import { getProgram } from '@/config/anchor/index';
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';
import { PROGRAM_ADDRESS } from '@/config/anchor/constants';
import { PublicKey } from '@solana/web3.js';

type FormSubmissionsAccount = IdlAccounts<typeof IDL>['formsubmissions'];

export async function POST(req: Request) {
  try {
    const {
      id,
      ownerPubkey,
    }: {
      id: string;
      ownerPubkey: string;
    } = await req.json();
    if (!id) {
      return new Response(JSON.stringify('Id is required!'), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }
    if (!ownerPubkey) {
      return new Response(JSON.stringify("Let's connect to your wallet"), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }

    const program = await getProgram();
    const ownerPublicKey = new PublicKey(ownerPubkey);
    // Lấy formAccount public key từ seeds
    const [formAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(id), ownerPublicKey.toBuffer()],
      PROGRAM_ADDRESS
    );
    const formAccountInfo = await program.account.form.fetch(formAccount);

    const FormSubmissionsAccount: ProgramAccount<FormSubmissionsAccount>[] =
      await program.account.formsubmissions.all([
        {
          memcmp: {
            offset: 8 + 4 + 32, // Tính toán offset dựa trên các trường trước trường owner
            bytes: formAccount.toBase58(),
          },
        },
      ]);

    const submissions = FormSubmissionsAccount.map(
      (account) => account.account
    );
    return new Response(
      JSON.stringify({ form: formAccountInfo, submissions: submissions }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
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
