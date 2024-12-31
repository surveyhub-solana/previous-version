'use client';
import LandingBanner from '@/app/(landing)/_components/landing-banner';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Value from '@/app/(landing)/_components/value';
import { FAQ } from '@/app/(landing)/_components/faq';
import Feature from '@/app/(landing)/_components/feature';
import Pricing from '@/app/(landing)/_components/pricing';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Landing() {
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
    <div>
      <div className="relative">
        <LandingBanner />
        <div className="box-container z-10 flex h-screen w-full flex-col items-center pt-64 md:pt-72 lg:pt-40">
          <div className="w-full text-center font-[family-name:var(--font-barely-enough)] text-[2.75rem] leading-none text-transparent md:text-6xl lg:text-8xl">
            <div className="bg-main-right bg-clip-text py-1 drop-shadow-2xl md:py-3">
              Share insights,
            </div>
            <div className="bg-main-right bg-clip-text py-1 drop-shadow-2xl md:py-3">
              enjoy instant rewards!
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3.5 text-black md:gap-8 lg:flex-row">
            <Link
              href={'#'}
              className="flex items-center gap-4 rounded-full bg-white p-2 text-center text-lg font-bold dark:bg-main-gray-01 md:w-[500px] lg:w-[300px]"
            >
              <Image
                src={'/image/sky/1.png'}
                alt="How it works?"
                width={200}
                height={200}
                className="me-auto ms-0 h-14 w-14 rounded-full object-cover"
              />
              How it works?
              <div className="me-2 ms-auto flex items-center justify-center rounded-full border-2 border-black">
                <ArrowUpRight />
              </div>
            </Link>
            <Link
              href={'#'}
              className="flex items-center gap-4 rounded-full bg-white p-2 text-center text-lg font-bold dark:bg-main-gray-01 md:w-[500px] lg:w-[300px]"
            >
              <Image
                src={'/image/sky/2.png'}
                alt="How to use?"
                width={200}
                height={200}
                className="me-auto ms-0 h-14 w-14 rounded-full object-cover"
              />
              How to use?
              <div className="me-2 ms-auto flex items-center justify-center rounded-full border-2 border-black">
                <ArrowUpRight />
              </div>
            </Link>
            <Link
              href={'#'}
              className="flex items-center gap-4 rounded-full bg-white p-2 text-center text-lg font-bold dark:bg-main-gray-01 md:w-[500px] lg:w-[300px]"
            >
              <Image
                src={'/image/sky/3.png'}
                alt="Supported Blockchains"
                width={200}
                height={200}
                className="me-auto ms-0 h-14 w-14 rounded-full object-cover"
              />
              Supported Blockchains
              <div className="me-2 ms-auto flex items-center justify-center rounded-full border-2 border-black">
                <ArrowUpRight />
              </div>
            </Link>
          </div>
        </div>
        <div className="box-container flex w-full flex-col-reverse items-center gap-4 py-10 md:flex-row md:gap-10">
          <div className="flex-1">
            <div className="flex text-3xl font-bold">
              <div>What is</div>
              <div>&nbsp;</div>
              <div className="bg-main-right bg-clip-text text-transparent">
                SurveyHub
              </div>
              <div>?</div>
            </div>
            <div className="mt-2 w-full max-w-[650px] text-sm font-normal text-main-gray-03 dark:text-main-gray-02">
              <div>
                SurveyHub – the multi-chain survey platform where you share
                insights and enjoy instant rewards effortlessly!
              </div>
              <div className="mt-1">
                SurveyHub lets you log in effortlessly with Google to join
                engaging surveys and earn instant rewards. Powered by blockchain
                technology, it ensures transparency, top-notch security, and an
                exceptional user experience. SurveyHub turns your opinions into
                real value, connecting you to a dynamic and rewarding digital
                future.
              </div>
            </div>
          </div>
          <div className="flex-none">
            <Image
              src={
                darkMode
                  ? '/branding/logomark-white-nobackground-nopadding.png'
                  : '/branding/logomark-nobackground-nopadding-transparent.png'
              }
              height={300}
              width={300}
              alt="SurveyHub"
              className="w-[200px] md:w-[300px]"
            />
          </div>
        </div>
        <div className="box-container w-full bg-background-light py-10 dark:bg-background-dark md:py-20">
          <Value />
        </div>
        <div className="box-container w-full py-10">
          <Feature />
        </div>
        <div className="box-container w-full py-10">
          <Pricing />
        </div>
        <div className="box-container w-full py-10">
          <FAQ />
        </div>
      </div>
    </div>
  );
}
