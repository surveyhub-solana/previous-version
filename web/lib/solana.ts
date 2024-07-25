import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

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

// src/transfer.ts
import { WalletContextState } from "@solana/wallet-adapter-react";

export const transferSOLToSystem = async (
  connection: Connection,
  wallet: WalletContextState,
  sumSOL: number
): Promise<{ success: boolean; message: string; signature?: string }> => {
  if (!wallet.publicKey) {
    return { success: false, message: "Wallet not connected" };
  }
  const systemPubkey = new PublicKey(
    "7MMat4Bi4zGjVXJdenuUNBd9eNVrKyMRf68QDGMQxLA7"
  );
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: systemPubkey,
      lamports: sumSOL * LAMPORTS_PER_SOL, // 1 SOL = 10^9 lamports
    })
  );

  try {
    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "processed");
    console.log("Transfer successful!");
    return { success: true, message: "Transfer successful", signature };
  } catch (error) {
    console.error("Transfer failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, message: `Transfer failed: ${errorMessage}` };
  }
};