"use client";
import Logo from "@/components/Logo";
import Link from "next/link";
import LaunchApp from "./launch-app";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function NavBar() {
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

  return (
    <div className="box-container absolute left-0 top-0 z-50 flex w-full items-center justify-center py-5">
      <div className="relative flex min-h-10 w-full items-center justify-center">
        <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center">
          <Logo color={!darkMode ? "black" : "white"} />
        </div>
        <div className="absolute right-0 top-0 flex h-full items-center justify-end">
          <LaunchApp />
        </div>
      </div>
    </div>
  );
}
