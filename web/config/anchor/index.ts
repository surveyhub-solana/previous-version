// config/anchor/backend.ts
'use server';

import * as anchor from '@project-serum/anchor';
import { Connection, Keypair, Transaction } from '@solana/web3.js';
import { IDL } from './idl'; // Đảm bảo rằng bạn đã cấu hình đúng đường dẫn
import { DEFAULT_COMMITMENT, NODE_URL, PROGRAM_ADDRESS } from './constants';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import { decode } from 'bs58';

export const getProvider = async () => {
  const connection = new Connection(NODE_URL, DEFAULT_COMMITMENT);

  const keypairBase58 = process.env.SOLANA_SECRET_KEY as string;
  const keypairBytes = decode(keypairBase58);
  const systemKeypair = Keypair.fromSecretKey(keypairBytes);
  const wallet = {
    publicKey: systemKeypair.publicKey,
    signTransaction: async (tx: Transaction) => {
      tx.partialSign(systemKeypair);
      return tx;
    },
    signAllTransactions: async (txs: Transaction[]) => {
      txs.forEach((tx) => tx.partialSign(systemKeypair));
      return txs;
    },
  } as anchor.Wallet;

  return new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: DEFAULT_COMMITMENT,
  });
};

export const getProgram = async () => {
  const provider = await getProvider();
  return new anchor.Program(IDL, PROGRAM_ADDRESS, provider);
};
