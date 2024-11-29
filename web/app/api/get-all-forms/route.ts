import { IDL } from '@/config/anchor/idl';
import { getProgram } from '@/config/anchor/index';
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';

type FormAccount = IdlAccounts<typeof IDL>['form'];

export async function POST(req: Request) {
  try {
    const program = await getProgram();
    const systemPublicKey = new PublicKey(process.env.SOLANA_PUBLIC_KEY || '');
    console.log(systemPublicKey);
    const formAccounts: ProgramAccount<FormAccount>[] =
      await program.account.form.all();

    // Lọc các form mà có publish = true
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
    return new Response(JSON.stringify(validForms), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error get all forms:', error);

    if (error instanceof Error) {
      console.error('Error get all forms:', error.message);
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
    console.error('Unknown error get all forms:', error);
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
