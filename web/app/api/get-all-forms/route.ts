import { IDL } from '@/config/anchor/idl';
import { getProgram } from '@/config/anchor/index';
import { deCompressedContent } from '@/lib/content';
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';
import { BN } from 'bn.js';

type FormAccount = IdlAccounts<typeof IDL>['form'];

export async function POST(req: Request) {
  try {
    const program = await getProgram();
    const formAccounts: ProgramAccount<FormAccount>[] =
      await program.account.form.all();

    console.log('formAccounts: ', formAccounts);

    // Lọc các form mà có publish = true
    const publishedForms = formAccounts
      .map((account) => account.account)
      .filter((form) => form.published);
    const validForms = publishedForms.filter((form) => {
      console.log('form.remainSol', form.remainSol);
      console.log('form.solPerUser', form.solPerUser);
      return (
        (form.remainSol as number) >= (form.solPerUser as number) &&
        (form.solPerUser as number) > 0
      );
    });

    console.log(validForms);

    if (validForms.length == 0) {
      return new Response(JSON.stringify('Form not found!'), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }
    const decompressedForms = validForms.map((form) => ({
      ...form,
      content: deCompressedContent(form.content as string),
    }));
    return new Response(JSON.stringify(decompressedForms), {
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
