"use client";
import { BannerLayer, ParallaxBanner } from "react-scroll-parallax";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LandingBanner() {
  const { resolvedTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  // Đồng bộ trạng thái darkMode với theme hiện tại
  useEffect(() => {
    if (resolvedTheme === "dark") {
      setDarkMode(() => true);
    } else {
      setDarkMode(() => false);
    }
  }, [resolvedTheme]);
  //   const background: BannerLayer = {
  //     image:
  //       "https://s3-us-west-2.amazonaws.com/s.cdpn.io/105988/banner-background.jpg",
  //     translateY: [0, 50],
  //     opacity: [1, 0.3],
  //     scale: [1.05, 1, "easeOutCubic"],
  //     shouldAlwaysCompleteAnimation: true,
  //   };
  const keyElement: BannerLayer = {
    translateX: [0, -30],
    opacity: [1, 0.3],
    shouldAlwaysCompleteAnimation: true,
    children: (
      <div>
        <Image
          src={
            darkMode ? "/image/elements/moon.gif" : "/image/elements/sun.gif"
          }
          alt="key"
          width={1000}
          height={1000}
          className="absolute right-6 top-16 w-[200px] dark:brightness-50 md:right-16 md:w-[250px]"
        />
      </div>
    ),
  };
  const cloud: BannerLayer = {
    opacity: [1, 0.3],
    shouldAlwaysCompleteAnimation: true,
    children: (
      <div>
        <Image
          src={"/image/elements/cloud.gif"}
          alt="cloud"
          width={1000}
          height={1000}
          className="absolute left-24 top-24 hidden w-[200px] dark:brightness-50 md:block"
        />
      </div>
    ),
  };

  const foreground: BannerLayer = {
    translateY: [0, -20],
    scale: [1, 1.1],
    shouldAlwaysCompleteAnimation: true,
    children: (
      <div>
        <Image
          src={"/image/elements/mountain-1.png"}
          alt="mountain"
          width={2500}
          height={2500}
          className="absolute bottom-0 right-0 w-[1000px] max-w-max translate-x-1/2 translate-y-2/3 dark:brightness-50 md:w-[2000px] lg:translate-y-1/2"
        />
      </div>
    ),
  };
  const cloud3: BannerLayer = {
    translateY: [0, 20],
    scale: [1, 1.1],
    opacity: [1, 0.2],
    shouldAlwaysCompleteAnimation: true,
    children: (
      <div>
        <Image
          src={"/image/elements/cloud-3.png"}
          alt="cloud3"
          width={2500}
          height={2500}
          className="absolute bottom-24 right-0 w-screen dark:brightness-50 lg:bottom-0 lg:translate-y-1/3"
        />
      </div>
    ),
  };
  const cloud4: BannerLayer = {
    translateX: [0, -20],
    opacity: [1, 0.2],
    shouldAlwaysCompleteAnimation: true,
    children: (
      <div>
        <Image
          src={"/image/elements/cloud-4.png"}
          alt="cloud4"
          width={2500}
          height={2500}
          className="absolute bottom-60 sm:bottom-80 left-0 w-[500px] -translate-x-1/3 dark:brightness-50 lg:bottom-0"
        />
      </div>
    ),
  };

  return (
    <ParallaxBanner
      layers={[cloud4, cloud3, foreground, keyElement, cloud]}
      className="!absolute left-0 top-0 -z-50 h-screen w-full bg-background-light dark:bg-background-dark"
    />
  );
}
