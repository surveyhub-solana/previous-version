"use client";

import { CloudMoon, CloudSun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ToggleMode() {
  const { resolvedTheme, setTheme } = useTheme();
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
    <div className="relative h-[50px]">
      <div
        className={`toggle-mode absolute flex h-[40px] w-[80px] cursor-pointer items-center justify-center rounded-md border-2 bg-white px-5 transition-all dark:bg-black`}
        onClick={() => {
          setTheme(() => (darkMode ? "light" : "dark"));
        }}
      >
        {darkMode ? <CloudMoon /> : <CloudSun />}
      </div>
    </div>
  );
}
