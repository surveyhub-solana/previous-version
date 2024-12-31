import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Feature() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative w-full overflow-hidden rounded-xl bg-card">
        <Image
          src={"/image/form/3.png"}
          alt=""
          width={500}
          height={500}
          className="absolute -bottom-1/4 -right-1/4 top-auto z-10 h-3/4 w-auto opacity-25 md:bottom-auto md:right-4 md:top-1/2 md:-translate-y-1/2 lg:opacity-40"
        />
        <div className="w-full p-8 lg:p-12">
          <div className="relative z-20 flex flex-col gap-2 md:w-2/3">
            <div>
              <Badge>Create Surveys</Badge>
            </div>
            <div className="text-2xl font-medium lg:text-4xl">
              Create engaging surveys to uncover your users&apos; genuine
              thoughts and insights about your product
            </div>
            <div className="text-sm text-main-gray-03 dark:text-main-gray-02">
              Unlock the power of authentic feedback with intuitive and
              impactful surveys. Gain a deeper understanding of your users’
              preferences, needs, and expectations to refine your product and
              elevate their experience
            </div>
            <Button className="w-fit bg-main-yellow-02 text-main-green-02 hover:bg-main-green-02 hover:text-main-yellow-02">
              Get started - It&apos;s free <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative w-full overflow-hidden rounded-xl bg-card">
          <Image
            src={"/image/form/1.png"}
            alt=""
            width={500}
            height={500}
            className="absolute -bottom-1/4 -right-1/4 z-10 h-2/3 w-auto opacity-25 lg:-bottom-4 lg:-right-4 lg:opacity-40"
          />
          <div className="w-full p-8 lg:p-12">
            <div className="relative z-20 flex w-full flex-col gap-2">
              <div>
                <Badge>Earn Rewards</Badge>
              </div>
              <div className="text-2xl font-medium lg:text-4xl">
                Share your insights and get rewarded for your valuable feedback
              </div>
              <div className="text-sm text-main-gray-03 dark:text-main-gray-02">
                Turn your opinions into rewards! Participate in surveys and earn
                exciting benefits for your time and input. Your thoughts matter,
                and now it’s more rewarding than ever
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-xl bg-card">
          <Image
            src={"/image/form/2.png"}
            alt=""
            width={500}
            height={500}
            className="absolute -bottom-1/4 -right-1/4 z-10 h-3/4 w-auto opacity-25 lg:-bottom-4 lg:-right-4 lg:opacity-40"
          />
          <div className="w-full p-8 lg:p-12">
            <div className="relative z-20 flex w-full flex-col gap-2">
              <div>
                <Badge>Discover Insights</Badge>
              </div>
              <div className="text-2xl font-medium lg:text-4xl">
                Dive deep into user data and transform insights into impactful
                strategies
              </div>
              <div className="text-sm text-main-gray-03 dark:text-main-gray-02">
                Access meaningful analytics to understand user behavior and
                preferences. Transform data into actionable strategies to
                improve your product and strengthen your connection with your
                audience
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
