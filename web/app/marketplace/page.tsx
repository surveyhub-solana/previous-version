'use client';
import WormholeConnect from '@wormhole-foundation/wormhole-connect';

export default function marketplace() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <WormholeConnect />
    </div>
  );
}
