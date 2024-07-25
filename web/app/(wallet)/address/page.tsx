"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function Address() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getAirdropOnClick = async () => {
    try {
      if (!publicKey) {
        throw new Error("Wallet is not Connected");
      }
      const [latestBlockhash, signature] = await Promise.all([
        connection.getLatestBlockhash(),
        connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL),
      ]);
      const sigResult = await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );
      if (sigResult) {
        alert("Airdrop was confirmed!");
      }
    } catch (err) {
      alert("You are Rate limited for Airdrop");
    }
  };

  const handleTransfer = async () => {
    try {
      if (!publicKey) {
        throw new Error("Wallet is not connected");
      }

      const recipientPubKey = new PublicKey(recipientAddress);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = publicKey;

      const simulationResult = await connection.simulateTransaction(
        transaction
      );

      if (simulationResult.value.err) {
        throw new Error("Transaction simulation failed");
      }

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      alert("Transaction successful!");
      setError(null); // Clear any previous error
    } catch (error: any) {
      console.error("Transaction failed", error);
      setError(error.message || "Transaction failed");
      alert("Transaction failed: " + (error.message || error));
    }
  };

  useEffect(() => {
    if (publicKey) {
      (async function getBalanceEvery10Seconds() {
        const newBalance = await connection.getBalance(publicKey);
        setBalance(newBalance / LAMPORTS_PER_SOL);
        setTimeout(getBalanceEvery10Seconds, 10000);
      })();
    }
  }, [publicKey, connection, balance]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      {publicKey ? (
        <div className="flex flex-col gap-4">
          <h1>Your Public key is: {publicKey?.toString()}</h1>
          <h2>Your Balance is: {balance} SOL</h2>
          <div>
            <button
              onClick={getAirdropOnClick}
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Get Airdrop
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Amount (SOL)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={handleTransfer}
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Transfer SOL
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      ) : (
        <h1>Wallet is not connected</h1>
      )}
    </main>
  );
}
