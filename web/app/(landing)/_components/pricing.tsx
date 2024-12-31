import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
const basicFeatures = [
  "Limit 100 responses per form",
  "Limit 20 forms per account",
  "Limit 20 questions per form",
  "Basic question types",
  "Automatic generation of questions",
  "Token reward feature",
];
const standardFeatures = [
  "Limit 1000 responses per form",
  "Limit 100 forms per account",
  "Unlimited questions per form",
  "All question types",
  "NFT rewards feature",
  "Everything in Basic",
  "Advanced data analysis tools",
  "Supports Action & Blinks on Solana",
];
const unlimitedFeatures = [
  "Unlimited responses per form",
  "Unlimited forms per account",
  "Everything in Standard",
  "Allows custom branding",
  "Conversion tracking",
  "Custom subdomain",
];

const packages = {
  basic: {
    name: "Basic",
    message: " Simple Start, Quick Discovery",
    price: (
      <div className="flex items-end justify-center">
        $0 <div className="text-base">.00/month</div>
      </div>
    ),
    buttonMessage: "Try it free",
    features: basicFeatures,
  },
  standard: {
    name: "Standard",
    message: "Accelerate Efficiency, Make Your Mark",
    price: (
      <div className="flex items-end justify-center">
        $19 <div className="text-base">.99/month</div>
      </div>
    ),
    buttonMessage: "Get Standard",
    features: standardFeatures,
  },
  unlimited: {
    name: "Unlimited",
    message: " No Limits, Maximize Your Potential",
    price: (
      <div className="flex items-end justify-center">
        $49 <div className="text-base">.99/month</div>
      </div>
    ),
    buttonMessage: "Update Now",
    features: unlimitedFeatures,
  },
};
export default function Pricing() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full items-center justify-center pb-5 text-3xl font-bold">
        Pricing Plan
      </div>
      <div className="grid w-full grid-cols-1 gap-4 text-center md:grid-cols-3 lg:gap-10">
        {Object.entries(packages).map(([key, packageItem]) => (
          <div
            key={key}
            className="flex flex-col overflow-hidden rounded-xl border bg-card py-10"
          >
            <div className="w-full flex-1">
              <div className="px-4">
                <div className="h-fit w-full text-center text-xl font-bold">
                  {packageItem.name}
                </div>
                <div className="h-10 w-full text-center text-sm text-main-gray-03 dark:text-main-gray-02">
                  {packageItem.message}
                </div>
                <div className="mt-5 w-full pb-4 text-3xl">
                  {packageItem.price}
                </div>
                <div className="flex w-full items-center justify-center">
                  <Button className="px-5" variant={"default"}>
                    {packageItem.buttonMessage}
                  </Button>
                </div>
                <Separator className="my-5" />
              </div>
              <div className="w-full text-sm text-main-gray-03 dark:text-main-gray-02">
                <div className="flex w-full flex-col">
                  {packageItem.features.map((feature) => (
                    <div
                      className="flex w-full items-center justify-center px-4 py-2 transition-all hover:border-l-4 hover:border-l-primary hover:bg-main-gray-01 hover:dark:bg-main-gray-04"
                      key={feature}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-10 flex w-full flex-none cursor-pointer items-center justify-center text-center underline">
              See all features
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
