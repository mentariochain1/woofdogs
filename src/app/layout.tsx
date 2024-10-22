import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SearchProvider } from '@/components/SearchContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WooDogs",
  description: "Buy and sell TON wallets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="preload" href="/dogs.gif" as="image" />
        <link rel="preload" href="/invite.gif" as="image" />
        <link rel="preload" href="/flag.gif" as="image" />
        <link rel="preload" href="/history.gif" as="image" />
        <link rel="preload" href="/inside.gif" as="image" />
        <link rel="preload" href="/notfound.gif" as="image" />
        <link rel="preload" href="/dogs.webp" as="image" />
        <link rel="preload" href="/invite.webp" as="image" />
      </Head>
      <body className={`${inter.className} bg-black`}>
        <LanguageProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
