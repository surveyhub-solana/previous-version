// config/anchor/backend.ts
'use server';

import * as anchor from '@project-serum/anchor';
import { Connection, Transaction } from '@solana/web3.js';
import { IDL } from './idl'; // Đảm bảo rằng bạn đã cấu hình đúng đường dẫn
import {
  DEFAULT_COMMITMENT,
  NODE_URL,
  PROGRAM_ADDRESS,
} from './constants';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';

export const getProvider = async () => {
  const connection = new Connection(NODE_URL, DEFAULT_COMMITMENT);

  const keypair = getKeypairFromEnvironment('SOLANA_SECRET_KEY');

  const wallet = {
    publicKey: keypair.publicKey,
    signTransaction: async (tx: Transaction) => {
      tx.partialSign(keypair);
      return tx;
    },
    signAllTransactions: async (txs: Transaction[]) => {
      txs.forEach((tx) => tx.partialSign(keypair));
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
