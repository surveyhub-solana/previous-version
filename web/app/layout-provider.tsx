'use client';
import { ThemeProvider } from '@/components/context/theme-provider';

import { Toaster } from '@/components/ui/toaster';
import { ParallaxProvider } from 'react-scroll-parallax';

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ParallaxProvider>
        <div>
          {children}
          <Toaster />
        </div>
      </ParallaxProvider>
    </ThemeProvider>
  );
}
