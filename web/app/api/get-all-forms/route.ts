import { IDL } from '@/config/anchor/idl';
import { getProgram } from '@/config/anchor/index';
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';

type FormAccount = IdlAccounts<typeof IDL>['form'];

export async function POST(req: Request) {
  try {
    const program = await getProgram();
    const formAccounts: ProgramAccount<FormAccount>[] =
      await program.account.form.all([
        {
          memcmp: {
            offset: 8 + 4 + 32, // Tính toán offset dựa trên các trường trước trường owner
            bytes: (process.env.SOLANA_PUBLIC_KEY as string),
          },
        },
      ]);

    const forms = formAccounts.map((account) => account.account);
    return new Response(JSON.stringify(forms), {
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