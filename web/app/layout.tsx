"use client";
import NavBar from "@/components/NavBar";
import AppWalletProvider from "../components/wallet/AppWalletProvider";
import "./globals.css";
import DesignerContextProvider from "@/components/context/DesignerContext";
import Logo from "@/components/Logo";
import { Toaster } from "@/components/ui/toaster";
import { getAuthorBalance } from "@/lib/solana";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { ReactNode, useEffect, useState } from "react";

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
              <NavBar/>
              <main className="flex w-full flex-grow">{children}</main>
              <Toaster />
            </div>
          </AppWalletProvider>
        </DesignerContextProvider>
      </body>
    </html>
  );
}
