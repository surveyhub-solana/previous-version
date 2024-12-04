import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { getProgram } from '@/config/anchor/index';
import { IDL } from '@/config/anchor/idl';
import {
  IdlAccounts,
  ProgramAccount,
  utils,
  web3,
} from '@project-serum/anchor';
import base58, { decode } from 'bs58';
import crypto from 'crypto';
import { PROGRAM_ADDRESS } from '@/config/anchor/constants';
import { compressedContent } from '@/lib/content';

type FormAccount = IdlAccounts<typeof IDL>['form'];

export async function POST(req: Request) {
  try {
    const {
      id,
      content,
      authorPubkey,
    }: { id: string; content: string; authorPubkey: string } = await req.json();
    if (!id || !content) {
      return new Response(JSON.stringify('Id and content are required!'), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }
    if (!authorPubkey) {
      return new Response(JSON.stringify("Let's connect to your wallet"), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 400,
      });
    }

    const authorPublicKey = new PublicKey(authorPubkey);
    const keypairBase58 = process.env.SOLANA_SECRET_KEY as string;
    const keypairBytes = decode(keypairBase58);
    const systemKeypair = Keypair.fromSecretKey(keypairBytes);
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
    if (formAccounts.length === 0) {
      return new Response(JSON.stringify('Form not found'), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 404,
      });
    }
    const submission_id = crypto.randomBytes(16).toString('hex');
    const [formSubmissionAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(submission_id), authorPublicKey.toBuffer()],
      PROGRAM_ADDRESS
    );
    const formAccount = formAccounts[0];
    const tx = new Transaction();
    // Lấy token_address từ formAccount
    // Lấy mint từ formAccount
    const mint = formAccount.account.mint as PublicKey;

    const compressed = compressedContent(content);

    let submitFormInstruction;
    if (mint) {
      // Trường hợp có mint (token_address)
      const systemTokenAccount = await utils.token.associatedAddress({
        mint: mint,
        owner: systemKeypair.publicKey,
      });

      const authorTokenAccount = await utils.token.associatedAddress({
        mint: mint,
        owner: authorPublicKey,
      });
      submitFormInstruction = await program.methods
        .submitFormToken(compressed, submission_id)
        .accounts({
          form: formAccount.publicKey,
          formSubmission: formSubmissionAccount,
          author: authorPublicKey,
          system: systemKeypair.publicKey,
          systemTokenAccount: systemTokenAccount,
          authorTokenAccount: authorTokenAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction();
    } else {
      // Trường hợp không có mint (token_address)
      submitFormInstruction = await program.methods
        .submitForm(compressed, submission_id)
        .accounts({
          form: formAccount.publicKey,
          formSubmission: formSubmissionAccount,
          author: authorPublicKey,
          system: systemKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();
    }

    tx.add(submitFormInstruction);

    // Set feePayer to authorPublicKey
    tx.feePayer = authorPublicKey;
    const connection = new Connection(clusterApiUrl('devnet'));
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    // Ký giao dịch bằng keypair hệ thống trước
    tx.partialSign(systemKeypair);

    // Serialize transaction and send to user for signature
    const serializedTx = tx.serialize({ requireAllSignatures: false });
    const base64Tx = serializedTx.toString('base64');

    return new Response(
      JSON.stringify({ transaction: base64Tx, id: submission_id }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error updating form:', error);

    if (error instanceof Error) {
      console.error('Error updating form:', error.message);
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
    console.error('Unknown error updating form:', error);
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
