/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CardValue({
  children,
  childrenValue,
  childrenAnimation,
  cardImage = "/image/sky/4.png",
}: {
  children: ReactNode;
  childrenValue: ReactNode;
  childrenAnimation: ReactNode;
  cardImage?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundImage: `url(${cardImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={cn("h-full w-full overflow-hidden rounded-xl")}
    >
      <div className="group/canvas-card bg-mask relative flex h-full w-full items-center justify-center overflow-hidden p-4 shadow-2xl md:p-8">
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 h-full w-full"
            >
              {childrenAnimation}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-20 h-full w-full">
          <div className="flex h-full w-full items-center justify-center text-center transition duration-200 group-hover/canvas-card:-translate-y-10 group-hover/canvas-card:opacity-0">
            {children}
          </div>
          <div className="relative z-10 h-full text-xl font-bold text-black opacity-0 transition duration-200 group-hover/canvas-card:-translate-y-[100%] group-hover/canvas-card:text-white group-hover/canvas-card:opacity-100 dark:text-white">
            {childrenValue}
          </div>
        </div>
      </div>
    </div>
  );
}
