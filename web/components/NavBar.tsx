'use client';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAuthorBalance } from '@/lib/solana';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from './ui/button';
import Link from 'next/link';
import { MdDashboardCustomize } from 'react-icons/md';
import { FaCartArrowDown } from 'react-icons/fa';

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
    <nav className="flex justify-end sm:justify-between items-center border-b border-border h-[60px] px-4 py-2">
      <Logo />
      <div className="width-fit flex justify-center items-stretch">
        {isClient && (
          <div className="font-bold me-2 items-center hidden sm:flex">
            {balance + ' SOL'}
          </div>
        )}
        {isClient && <WalletMultiButton style={{}} />}
        <Button
          asChild
          className="w-fit h-auto rounded-[5px] text-xl ms-2 px-6"
          variant={'secondary'}
        >
          <Link href={`/dashboard`} className="w-fit">
            <MdDashboardCustomize />
          </Link>
        </Button>
        <Button
          asChild
          className="w-fit h-auto rounded-[5px] text-xl ms-2 px-6"
          variant={'secondary'}
        >
          <Link href={`/marketplace`} className="w-fit">
            <FaCartArrowDown />
          </Link>
        </Button>
      </div>
    </nav>
  );
}
