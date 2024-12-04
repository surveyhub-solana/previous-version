import { PROGRAM_ADDRESS } from '@/config/anchor/constants';
import { getProgram } from '@/config/anchor/index';
import { deCompressedContent } from '@/lib/content';
import { PublicKey } from '@solana/web3.js';


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
    const [formAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(id), ownerPublicKey.toBuffer()],
      PROGRAM_ADDRESS
    );

    // Fetch form account data
    const form = await program.account.form.fetch(formAccount);

    return new Response(JSON.stringify({...form, content: deCompressedContent(form.content as string)}), {
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
