import { PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import { getProgram, getProvider } from '@/config/anchor/index';
import { PROGRAM_ADDRESS } from '@/config/anchor/constants';
import { utils, web3 } from '@project-serum/anchor';

export async function detectTokenProgram(tokenAddress: string) {
  const provider = await getProvider();
  const accountInfo = await provider.connection.getAccountInfo(
    new PublicKey(tokenAddress)
  );
  if (!accountInfo || !accountInfo.owner) {
    throw new Error('Invalid token address');
  }

  return accountInfo.owner.toString(); // Trả về chương trình sở hữu token
}

export async function POST(req: Request) {
  try {
    const {
      id,
      sum_sol,
      sol_per_user,
      token_address,
      ownerPubkey,
    }: {
      id: string;
      sum_sol: number;
      sol_per_user: number;
      token_address: string;
      ownerPubkey: string;
    } = await req.json();

    // Kiểm tra các trường bắt buộc
    if (!id || !sum_sol || !sol_per_user) {
      return new Response(
        JSON.stringify('Id, sum SOL and SOL per user are required!'),
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
    const provider = await getProvider();

    // Tạo formAccount public key từ seeds
    const [formAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(id), ownerPublicKey.toBuffer()],
      PROGRAM_ADDRESS
    );

    const tx = new Transaction();
    let updateFormSOLInstruction;

    if (token_address && token_address !== '') {
      const detectedProgram = await detectTokenProgram(token_address);
      if (detectedProgram !== anchor.utils.token.TOKEN_PROGRAM_ID.toString()) {
        return new Response(
          JSON.stringify({
            message:
              'Only SPL Tokens from the standard token program are accepted.',
            error: `Invalid token program: ${detectedProgram}`,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
            status: 400,
          }
        );
      }

      const mint = new PublicKey(token_address);
      const systemTokenAccount = await utils.token.associatedAddress({
        mint: mint,
        owner: systemKeypair.publicKey,
      });

      const ownerTokenAccount = await utils.token.associatedAddress({
        mint: mint,
        owner: ownerPublicKey,
      });

      updateFormSOLInstruction = await program.methods
        .updateFormToken(
          new anchor.BN(Math.floor(sum_sol)),
          new anchor.BN(Math.floor(sol_per_user))
        )
        .accounts({
          form: formAccount,
          owner: ownerPublicKey,
          system: systemKeypair.publicKey,
          systemTokenAccount: systemTokenAccount,
          ownerTokenAccount: ownerTokenAccount,
          mint: mint,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction();
    } else {
      console.log('Khối else');
      updateFormSOLInstruction = await program.methods
        .updateFormSol(new anchor.BN(sum_sol), new anchor.BN(sol_per_user))
        .accounts({
          form: formAccount,
          owner: ownerPublicKey,
          system: systemKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();
      console.log('Token Address: ', token_address);
    }

    tx.add(updateFormSOLInstruction);

    // Set feePayer to system's public key
    tx.feePayer = systemKeypair.publicKey;
    const recentBlockhash = await provider.connection.getRecentBlockhash();
    tx.recentBlockhash = recentBlockhash.blockhash;

    // Ký giao dịch bằng keypair hệ thống trước
    tx.partialSign(systemKeypair);

    // Serialize transaction and send to user for signature
    const serializedTx = tx.serialize({ requireAllSignatures: false });
    const base64Tx = serializedTx.toString('base64');

    return new Response(JSON.stringify({ transaction: base64Tx, id: id }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error updating form:', error);

    if (error instanceof Error) {
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
