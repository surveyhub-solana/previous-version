import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ() {
  return (
    <div className="w-full">
      <div className="text-center text-3xl font-bold">FAQ</div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-medium">
            How does this survey platform work?
          </AccordionTrigger>
          <AccordionContent>
            SurveyHub is a blockchain-based survey platform that offers a
            transparent and unique reward system for participants. By
            integrating proxy wallets, the platform allows seamless access for
            both Web2 and Web3 users. Web2 users can log in quickly using their
            Google accounts, while Web3 users can connect their crypto wallets
            to participate in surveys and claim rewards.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-medium">
            What do I need to get started?
          </AccordionTrigger>
          <AccordionContent>
            <div>
              To start using SurveyHub, simply log in using one of the following
              methods:
            </div>
            <ul className="ms-[15px] list-disc">
              <li>
                Web2 users: Log in with your Google account or other social
                media accounts.
              </li>
              <li>
                Web3 users: Connect your crypto wallet, or log in via Google
                through the proxy wallet with multichain support.
              </li>
            </ul>
            <div>
              Once logged in, you can begin participating in surveys and earning
              rewards.
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-medium">
            How do I participate in surveys?
          </AccordionTrigger>
          <AccordionContent>
            After logging in, you’ll see a list of active surveys on the
            platform’s interface. You can select a survey that suits you and
            complete it directly on the platform. <br />
            Additionally, for surveys deployed on the Solana network, you can
            participate through social platforms like Discord or X (Twitter),
            providing flexibility and accessibility for the community.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-medium">
            How do I receive rewards?
          </AccordionTrigger>
          <AccordionContent>
            <div>Rewards are distributed directly to:</div>
            <ul className="ms-[15px] list-disc">
              <li>Your account or Proxy Wallet if you’re a Web2 user.</li>
              <li>Your crypto wallet if you’re a Web3 user.</li>
            </ul>
            <div>
              You can easily check and manage your rewards on the platform’s
              dashboard.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
