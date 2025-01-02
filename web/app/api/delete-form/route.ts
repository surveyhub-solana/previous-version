import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { getProgram, getProvider } from '@/config/anchor/index';
import { PROGRAM_ADDRESS } from '@/config/anchor/constants';
import { utils, web3 } from '@project-serum/anchor';
import { decode } from 'bs58';
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

    const ownerPublicKey = new PublicKey(ownerPubkey);
    const keypairBase58 = process.env.SOLANA_SECRET_KEY as string;
    const keypairBytes = decode(keypairBase58);
    const systemKeypair = Keypair.fromSecretKey(keypairBytes);
    const program = await getProgram();
    const provider = await getProvider();

    // Tạo formAccount public key từ seeds
    const [formAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(id), ownerPublicKey.toBuffer()],
      PROGRAM_ADDRESS
    );

    // Lấy thông tin form để kiểm tra mint (token_address)
    const formAccountInfo = await program.account.form.fetch(formAccount);
    const mint = formAccountInfo.mint as PublicKey | null;

    const tx = new Transaction();
    let deleteFormInstruction;

    if (mint) {
      // Trường hợp có token_address (mint)
      const systemTokenAccount = await utils.token.associatedAddress({
        mint: mint,
        owner: systemKeypair.publicKey,
      });

      const ownerTokenAccount = await utils.token.associatedAddress({
        mint: mint,
        owner: ownerPublicKey,
      });

      deleteFormInstruction = await program.methods
        .deleteFormToken()
        .accounts({
          form: formAccount,
          owner: ownerPublicKey,
          system: systemKeypair.publicKey,
          systemTokenAccount: systemTokenAccount,
          ownerTokenAccount: ownerTokenAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction();
    } else {
      // Trường hợp không có token_address (mint)
      deleteFormInstruction = await program.methods
        .deleteForm()
        .accounts({
          form: formAccount,
          owner: ownerPublicKey,
          system: systemKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();
    }

    tx.add(deleteFormInstruction);
    // Set feePayer to authorPublicKey
    tx.feePayer = systemKeypair.publicKey;
    const recentBlockhash = await provider.connection.getLatestBlockhash();
    tx.recentBlockhash = recentBlockhash.blockhash;

    // Ký giao dịch bằng keypair hệ thống trước
    tx.partialSign(systemKeypair);

    // Serialize transaction and send to user for signature
    const serializedTx = tx.serialize({ requireAllSignatures: false });
    const base64Tx = serializedTx.toString('base64');

    return new Response(JSON.stringify({ transaction: base64Tx }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error delete form:', error);
    if (error instanceof Error) {
      console.error('Error delete form:', error.message);
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
    console.error('Unknown error delete form:', error);
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
