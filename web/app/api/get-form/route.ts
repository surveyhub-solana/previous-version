import { IDL } from '@/config/anchor/idl';
import { getProgram } from '@/config/anchor/index';
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';
import base58 from 'bs58'; // Thêm thư viện mã hóa base58 nếu cần

type FormAccount = IdlAccounts<typeof IDL>['form'];

export async function POST(req: Request) {
  try {
    const id = await req.json();
    const program = await getProgram();
    const idBytes = Buffer.from(id);
    const formAccounts: ProgramAccount<FormAccount>[] =
      await program.account.form.all([
        {
          memcmp: {
            offset: 8 + 4, // Tính toán offset dựa trên các trường trước trường owner
            bytes: base58.encode(idBytes),
          },
        },
      ]);

    const forms = formAccounts.map((account) => account.account);
    return new Response(JSON.stringify(forms[0]), {
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
