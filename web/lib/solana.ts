import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';


export async function getAuthorBalance(
  connection: Connection,
  wallet: WalletContextState
) {
  if (!wallet.publicKey) {
    return 0;
  }
  const authorBalance = await connection.getBalance(wallet.publicKey);
  console.log(authorBalance);
  return authorBalance / LAMPORTS_PER_SOL;
}
