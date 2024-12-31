'use client';

import { FaXTwitter } from 'react-icons/fa6';
import { FiGithub } from 'react-icons/fi';
import { FaDiscord, FaFacebookF, FaTelegramPlane } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const socialInformation = [
  {
    name: 'GitHub',
    href: 'https://github.com/surveyhub-solana',
    icon: <FiGithub />,
  },
  {
    name: 'X',
    href: 'https://x.com/SnapPollWeb3',
    icon: <FaXTwitter />,
  },
  {
    name: 'Telegram',
    href: '#',
    icon: <FaTelegramPlane />,
  },
  {
    name: 'Discord',
    href: '#',
    icon: <FaDiscord />,
  },
  {
    name: 'Facebook',
    href: '#',
    icon: <FaFacebookF />,
  },
];
export default function Social({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {socialInformation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full bg-black p-1.5 text-sm text-white dark:bg-white dark:text-black"
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
}
