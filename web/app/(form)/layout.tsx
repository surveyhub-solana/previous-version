import NavBar from '@/components/NavBar';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <NavBar />
      <main className="flex w-full flex-grow">{children}</main>
      <Toaster />
    </div>
  );
}
