"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAuthorBalance } from "@/lib/solana";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function NavBar() {
  const [isClient, setIsClient] = useState(false);
  const [balance, setBalance] = useState(0);
  const wallet = useWallet();
  const { connection } = useConnection();
  useEffect(() => {
    setIsClient(true);
    const getBalance = async () => {
      const authorBalance = await getAuthorBalance(connection, wallet);
      setBalance(authorBalance);
    };
    getBalance();
  }, [wallet, connection]);
  return (
    <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
      <Logo />
      <div className="width-fit flex justify-center items-center">
        {isClient && <div className="font-bold me-2">{balance + " SOL"}</div>}
        {isClient && <WalletMultiButton style={{}} />}
      </div>
    </nav>
  );
}
