import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import CardValue from './card-value';
import Image from 'next/image';

const values = [
  {
    children: (
      <div className="flex h-full w-full flex-col items-center justify-end">
        <div className="w-full">
          <div className="flex h-[100px] items-center gap-2">
            <div className="flex-none">
              <Image
                src={
                  '/branding/logomark-nobackground-nopadding-transparent.png'
                }
                alt="SurveyHub"
                width={60}
                height={60}
              />
            </div>
            <div className="flex flex-1 items-center text-left text-xl font-bold">
              Seamlessly connect with your account
            </div>
          </div>
          <div className="text-left font-normal">
            <ul className="ms-[15px] list-disc">
              <li>Decentralized survey experience</li>
              <li>
                No wallet required, easy participation with faster on-chain
                experience powered by blockchain
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
    childrenValue: (
      <div className="flex h-full w-full flex-col items-center justify-center text-3xl">
        <Image
          src={'/branding/logomark-white-nobackground-nopadding.png'}
          width={150}
          height={150}
          alt=""
        />
        Easy to use
      </div>
    ),
    childrenAnimation: (
      <CanvasRevealEffect
        animationSpeed={3}
        containerClassName="bg-black"
        dotSize={2.5}
        colors={[[125, 211, 252]]}
      />
    ),
    cardImage: '/image/sky/4.png',
  },
  {
    children: (
      <div className="flex h-full w-full flex-col items-center justify-end">
        <div className="w-full">
          <div className="flex h-[100px] items-center gap-2">
            <div className="flex-none">
              <Image
                src={'/chains/solana.svg'}
                alt="Solana"
                width={60}
                height={60}
              />
            </div>
            <div className="flex flex-1 items-center text-left text-xl font-bold">
              Actions & Blinks
            </div>
          </div>
          <div className="text-left font-normal">
            <ul className="ms-[15px] list-disc">
              <li>
                Effortlessly share surveys on X (Twitter) with Blink Technology.
              </li>
              <li>Powered by Solana for a fast, seamless experience.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    childrenValue: (
      <div className="flex h-full w-full flex-col items-center justify-center text-3xl">
        <Image
          src={'/branding/logomark-white-nobackground-nopadding.png'}
          width={150}
          height={150}
          alt=""
        />
        Fast & Efficient
      </div>
    ),
    childrenAnimation: (
      <CanvasRevealEffect
        animationSpeed={3}
        containerClassName="bg-black"
        colors={[[234, 88, 12]]}
        dotSize={2.5}
      />
    ),
    cardImage: '/image/sky/5.png',
  },
  {
    children: (
      <div className="flex h-full w-full flex-col items-center justify-end">
        <div className="w-full">
          <div className="flex h-[100px] items-center gap-2">
            <div className="flex-none">
              <Image src={'/token.svg'} alt="Token" width={60} height={60} />
            </div>
            <div className="flex flex-1 items-center text-left text-xl font-bold">
              Reward System
            </div>
          </div>
          <div className="text-left font-normal">
            <ul className="ms-[15px] list-disc">
              <li>Earn tokens or NFTs as rewards for your participation</li>
              <li>Supported on multiple blockchains for greater flexibility</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    childrenValue: (
      <div className="flex h-full w-full flex-col items-center justify-center text-3xl">
        <Image
          src={'/branding/logomark-white-nobackground-nopadding.png'}
          width={150}
          height={150}
          alt=""
        />
        Flexible Rewards
      </div>
    ),
    childrenAnimation: (
      <CanvasRevealEffect
        animationSpeed={3}
        containerClassName="bg-black"
        colors={[[12, 74, 110]]}
        dotSize={2.5}
      />
    ),
    cardImage: '/image/sky/6.png',
  },
];

export default function Value() {
  return (
    <div className="grid w-full grid-cols-1 content-center gap-10 text-white lg:grid-cols-3">
      {values.map((value, index) => (
        <CardValue
          key={index}
          childrenValue={value.childrenValue}
          childrenAnimation={value.childrenAnimation}
          cardImage={value.cardImage}
        >
          {value.children}
        </CardValue>
      ))}
    </div>
  );
}
