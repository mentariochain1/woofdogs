import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import TonConnectProvider from '@/components/TonConnectProvider';
import React from 'react';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "WooDogs",
  description: "WooDogs - TON Wallet Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <TonConnectProvider>
          <React.Fragment>{children}</React.Fragment>
        </TonConnectProvider>
      </body>
    </html>
  );
}
