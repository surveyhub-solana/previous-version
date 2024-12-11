import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Readme() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center py-32">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  return (
    <div className="w-full flex overflow-auto items-center justify-center py-4">
      <div className="h-fit w-[80%] md:w-[60%]">
        <div className="flex-none">
          <div className="text-2xl font-bold">
            Getting Started with SurveyHub (You are not logged in)
          </div>
          <div className="text-muted-foreground font-semibold py-2 w-full border-b-2">
            Welcome to SurveyHub, an online survey platform powered by
            Blockchain technology!!!
          </div>
        </div>
        <div className="w-full">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">
                Introduction
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-justify">
                <div className="border-t-2">
                  <div className="text-lg font-semibold pt-2">
                    What is SurveyHub?
                  </div>
                  <div className="py-3">
                    SurveyHub is a Web3-powered online survey platform that
                    utilizes blockchain technology to ensure transparency,
                    security, and efficiency in the survey process. It offers a
                    decentralized solution where participants can earn rewards
                    for completing surveys, and data purchasers can access
                    reliable, blockchain-verified survey data.
                  </div>
                </div>
                <div className="border-t-2">
                  <div className="text-lg font-semibold pt-2">
                    What is Web3?
                  </div>
                  <div className="py-3">
                    Web3 is the next generation of the internet, where
                    decentralized applications (dApps) enable users to fully
                    control their data and interact securely through blockchain
                    technology, all without intermediaries. It offers benefits
                    like data ownership, transparent and secure transactions,
                    and a decentralized, community-driven network.
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold">
                How to use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-justify">
                <div className="border-t-2">
                  <div className="text-lg font-semibold pt-2">
                    How to use SurveyHub?
                  </div>
                  <div className="py-3">
                    <ol>
                      <li>
                        <strong>Step 1:</strong> Visit{' '}
                        <Link
                          href="https://surveyhub.tech"
                          target="_blank"
                          className="underline"
                        >
                          surveyhub.tech
                        </Link>
                      </li>
                      <li>
                        <strong>Step 2:</strong> Click the &ldquo;Select
                        Wallet&rdquo; button on the NavBar to log in to your
                        wallet. (If you don&#39;t have a wallet, please refer to
                        the guide below.)
                      </li>
                      <li>
                        <strong>Step 3:</strong> Once logged in, you can fill
                        out forms directly on the homepage or go to the{' '}
                        <Link
                          href={'https://surveyhub.tech/dashboard'}
                          className="underline"
                        >
                          /dashboard
                        </Link>{' '}
                        to create and manage your own forms.
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="border-t-2">
                  <div className="text-lg font-semibold pt-2">
                    How to set up a Wallet?
                  </div>
                  <div className="py-3">
                    <ul>
                      <li>
                        <strong className="pb-2">
                          For Computers (Browser Extension):
                        </strong>
                        <ol className="py-2">
                          <li>
                            <strong>Step 1:</strong> Open the Chrome Web Store
                            (for Chrome) or Firefox Add-ons (for Firefox).
                            Chrome:{' '}
                            <Link
                              href={
                                'https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa'
                              }
                              className="underline"
                            >
                              Phantom
                            </Link>
                            ,{' '}
                            <Link
                              href={
                                'https://chromewebstore.google.com/detail/bitget-wallet-tr%C6%B0%E1%BB%9Bc-%C4%91%C3%A2y-l/jiidiaalihmmhddjgbnbgdfflelocpak'
                              }
                              className="underline"
                            >
                              Bitget
                            </Link>
                          </li>
                          <li>
                            <strong>Step 2:</strong> Search for a supported
                            wallet such as Phantom or Bitget.
                          </li>
                          <li>
                            <strong>Step 3:</strong> Click &ldquo;Add to
                            Chrome&rdquo; (or &ldquo;Add to Firefox&rdquo;) to
                            install the extension.
                          </li>
                          <li>
                            <strong>Step 4:</strong> After installation, the
                            wallet icon will appear in your browser&#39;s
                            toolbar.
                          </li>
                          <li>
                            <strong>Step 5:</strong> Click on the wallet icon
                            and follow the on-screen instructions to create a
                            new wallet or import an existing wallet using your
                            recovery phrase.
                          </li>
                          <li>
                            <strong>Step 6:</strong> Once setup is complete,
                            your wallet will be ready to use on Web3 sites like
                            SurveyHub.
                          </li>
                        </ol>
                      </li>

                      <li>
                        <strong>For Mobile Phones (App Installation):</strong>
                        <ol className="py-2">
                          <li>
                            <strong>Step 1:</strong> Open the App Store (iOS) or
                            Google Play Store (Android).
                          </li>
                          <li>
                            <strong>Step 2:</strong> Search for a supported
                            wallet such as Phantom or Bitget Wallet.
                          </li>
                          <li>
                            <strong>Step 3:</strong> Download and install the
                            app.
                          </li>
                          <li>
                            <strong>Step 4:</strong> Open the app and choose
                            &ldquo;Create a New Wallet&rdquo; to generate a
                            wallet or &ldquo;Import Wallet&rdquo; to restore an
                            existing wallet using your recovery phrase.
                          </li>
                          <li>
                            <strong>Step 5:</strong> Set up a password for your
                            wallet and back up your recovery phrase securely
                            (never share it with anyone).
                          </li>
                          <li>
                            <strong>Step 6:</strong> Once setup is complete, you
                            can connect your mobile wallet to Web3 apps like
                            SurveyHub.
                          </li>
                        </ol>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
