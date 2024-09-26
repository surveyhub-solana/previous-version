import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

function Logo() {
  return (
    <Link
      href={'/'}
      className="hidden sm:block hover:cursor-pointer h-full aspect-square relative"
    >
      <Image src={'/branding/LOGO.png'} fill alt="" />
    </Link>
  );
}

export default Logo;
