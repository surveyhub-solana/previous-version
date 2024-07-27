import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import { getProgram } from '@/config/anchor/index';
import { PROGRAM_ADDRESS } from '@/config/anchor/constants';
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
      return new Response(
        JSON.stringify('Id is required!'),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 400,
        }
      );
    }
    if (!ownerPubkey) {
      return new Response(JSON.stringify("Let's connect to your wallet"), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }

    const ownerPublicKey = new PublicKey(ownerPubkey);
    const systemKeypair = getKeypairFromEnvironment('SOLANA_SECRET_KEY');
    const program = await getProgram();

    // Tạo formAccount public key từ seeds
    const [formAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(id), ownerPublicKey.toBuffer()],
      PROGRAM_ADDRESS
    );

// Gửi giao dịch lên mạng Solana
    await program.methods
      .publishForm()
      .accounts({
        form: formAccount,
        owner: ownerPublicKey,
        system: systemKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([systemKeypair])
      .rpc();

    return new Response(JSON.stringify({ id: id }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error publish form:', error);

    if (error instanceof Error) {
      console.error('Error publish form:', error.message);
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
    console.error('Unknown error publish form:', error);
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
