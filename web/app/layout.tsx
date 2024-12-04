import NavBar from '@/components/NavBar';
import AppWalletProvider from '../components/wallet/AppWalletProvider';
import './globals.css';
import DesignerContextProvider from '@/components/context/DesignerContext';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import type { Viewport } from 'next';
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
    'SurveyHub - Nền tảng ứng dụng công nghệ Blockchain trên Solana vào khảo sát trực tuyến giúp các dữ liệu khảo sát minh bạch và có tính ứng dụng cao. Bên cạnh đó SurveyHub cung cấp các thông tin từ dữ liệu khảo sát tới người dùng thông qua việc tích hợp AI và huấn luyện trên tập dữ liệu Blockchain.',
  openGraph: {
    images: 'https://www.surveyhub.tech/branding/logomark-nopadding.png',
    title: 'SurveyHub',
    description:
      'SurveyHub - Nền tảng khảo sát trực tuyến ứng dụng công nghệ Blockchain',
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
            <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
              <NavBar />
              <main className="flex w-full flex-grow">{children}</main>
              <GoogleAnalytics gaId="G-YXJ9S5SVWR" />
              <SpeedInsights />
              <Toaster />
            </div>
          </AppWalletProvider>
        </DesignerContextProvider>
      </body>
    </html>
  );
}
