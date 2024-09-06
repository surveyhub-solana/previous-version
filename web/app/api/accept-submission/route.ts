import { PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import { getProgram, getProvider } from '@/config/anchor/index';
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from '@solana/spl-token';

export async function POST(req: Request) {
  try {
    const { address, code } = await req.json(); // No need for amount now, as it's fixed
    console.log(address);
    console.log(code);
    if (!address || !code) {
      return new Response(
        JSON.stringify('Address and Access Code are required!'),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 400,
        }
      );
    }
    if (code != process.env.ACCESS_CODE) {
      return new Response(
        JSON.stringify('The access code you entered is incorrect.'),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 400,
        }
      );
    }

    const systemKeypair = getKeypairFromEnvironment('SOLANA_SECRET_KEY');
    const provider = await getProvider();
    const connection = provider.connection;

    // Hardcoded mint address (this is your existing mint)
    const mintAddress = new PublicKey(
      '88udKAcK2hioJND3kY4eZ7Yj81bsHSvYPnunr41c6MTP'
    );

    // Recipient's address (hardcoded or provided in request)
    const recipientAddress = new PublicKey(address);

    // Get or create the associated token account for the recipient
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      systemKeypair, // Payer
      mintAddress, // Existing Mint address
      recipientAddress // Recipient's public key
    );

    // Get or create the associated token account for the sender (systemKeypair)
    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      systemKeypair, // Payer
      mintAddress, // Existing Mint address
      systemKeypair.publicKey // Sender's public key
    );

    // Fixed amount to transfer (10 tokens)
    const amountToSend = 10;

    // Transfer tokens from sender to recipient
    const signature = await transfer(
      connection, // The connection to the Solana cluster
      systemKeypair, // The payer of the transaction fees
      senderTokenAccount.address, // Source account (sender)
      recipientTokenAccount.address, // Destination account (recipient)
      systemKeypair.publicKey, // Owner of the source account
      amountToSend * 10 ** 9, // Amount of tokens to transfer (assuming 9 decimal places for SPL tokens)
      [], // Multisig signers (empty if not using multisig)
      { skipPreflight: false, commitment: 'confirmed' }, // Transaction options
      TOKEN_PROGRAM_ID // The program ID of the SPL token program
    );

    return new Response(
      JSON.stringify({
        message: 'Tokens successfully transferred!',
        signature,
        recipientTokenAccount: recipientTokenAccount.address.toBase58(),
        amountSent: amountToSend,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error accept submission:', error);

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
