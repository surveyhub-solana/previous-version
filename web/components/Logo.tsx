import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

function Logo({ color }: { color?: 'white' | 'black' }) {
  return (
    <Link
      href={'/'}
      className="hidden sm:block hover:cursor-pointer h-full aspect-square relative"
    >
      <Image
        src={
          color == 'white'
            ? '/branding/logomark-white-nopadding.png'
            : '/branding/logomark-nopadding.png'
        }
        fill
        alt=""
      />
    </Link>
  );
}

export default Logo;
