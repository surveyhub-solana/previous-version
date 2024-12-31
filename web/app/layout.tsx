import NavBar from '@/components/NavBar';
import AppWalletProvider from '@/components/wallet/AppWalletProvider';
import './globals.css';
import DesignerContextProvider from '@/components/context/DesignerContext';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { ParallaxProvider } from 'react-scroll-parallax';
import { ThemeProvider } from 'next-themes';
import LayoutProvider from './layout-provider';
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export const metadata: Metadata = {
  applicationName: 'SurveyHub',
  keywords: [
    'SurveyHub',
    'Survey',
    'Survey Hub',
    'On Chain',
    'Online Survey',
    'Blockchain',
    'Solana',
    'Khảo sát',
    'Khảo sát trực tuyến',
    'SurveyHub với khảo sát trực tuyến',
    'Survey Hub với khảo sát trực tuyến',
    'Technology',
    'Web3',
  ],
  creator: 'Liam Lee',
  publisher: 'Liam Lee',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: 'SurveyHub Solana',
  description:
    'SurveyHub is an all-in-one survey platform on the Solana blockchain, providing an engaging experience throughout the entire survey process.',
  openGraph: {
    images: 'https://www.surveyhub.tech/branding/actions.png',
    title: 'SurveyHub',
    description:
      'SurveyHub is an all-in-one survey platform on the Solana blockchain, providing an engaging experience throughout the entire survey process.',
    url: 'https://www.surveyhub.tech/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DesignerContextProvider>
          <AppWalletProvider>
            <LayoutProvider>{children}</LayoutProvider>
            <GoogleAnalytics gaId="G-YXJ9S5SVWR" />
            <SpeedInsights />
          </AppWalletProvider>
        </DesignerContextProvider>
      </body>
    </html>
  );
}
