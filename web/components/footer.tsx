'use client';
import Logo from '@/components/Logo';
import Social from '@/components/social';
import ToggleMode from '@/components/toggle-mode';
import Email from '@/components/email';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  // Đồng bộ trạng thái darkMode với theme hiện tại
  useEffect(() => {
    if (resolvedTheme === 'dark') {
      setDarkMode(() => true);
    } else {
      setDarkMode(() => false);
    }
  }, [resolvedTheme]);
  return (
    <footer className="box-container w-full py-5">
      <div className="flex flex-col gap-4 rounded-xl bg-card p-4 sm:flex-row">
        <div className="flex w-full flex-col gap-4 sm:w-1/3">
          <div>
            <Logo color={!darkMode ? 'black' : 'white'} />
          </div>
          <div>
            <Social />
          </div>
          <div className="text-main-gray-03 dark:text-main-gray-02 text-sm">
            SurveyHub aims to seamlessly integrate Web2 and Web3 technologies,
            creating a bridge that expands the survey audience by catering to
            both traditional users and blockchain enthusiasts.
          </div>
          <div>
            <ToggleMode />
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 sm:w-2/3">
          <div className="flex w-full flex-1 items-center justify-end">
            <Email />
          </div>
          <div className="w-full flex-none text-end text-sm">
            Contact us via email:{' '}
            <Link href={'mailto:snappoll.web3@gmail.com'}>
              snappoll.web3@gmail.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
