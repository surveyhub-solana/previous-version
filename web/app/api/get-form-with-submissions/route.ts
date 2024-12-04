import { IDL } from '@/config/anchor/idl';
import { getProgram } from '@/config/anchor/index';
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';
import { PROGRAM_ADDRESS } from '@/config/anchor/constants';
import { PublicKey } from '@solana/web3.js';
import { deCompressedContent } from '@/lib/content';

type FormSubmissionsAccount = IdlAccounts<typeof IDL>['formSubmissions']; // Đảm bảo tên đúng với IDL của bạn

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

    const formSubmissionsAccounts: ProgramAccount<FormSubmissionsAccount>[] =
      await program.account.formSubmissions.all([
        {
          memcmp: {
            offset: 8 + 4 + 32, // Tính toán offset dựa trên các trường trước trường owner
            bytes: formAccount.toBase58(),
          },
        },
      ]);

    const submissions = formSubmissionsAccounts.map(
      (account) => account.account
    );
    const decompressedSubmittions = submissions.map((submission) => ({
      ...submission,
      content: deCompressedContent(submission.content as string),
    }));
    const decompressedForm = {
      ...formAccountInfo,
      content: deCompressedContent(formAccountInfo.content as string),
    };
    return new Response(
      JSON.stringify({
        form: decompressedForm,
        submissions: decompressedSubmittions,
      }),
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
