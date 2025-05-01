import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import RootLayoutClient from '../components/RootLayoutClient';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BML Data Station",
  description: "Brain Music Lab Data Recording",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;" />
        <meta httpEquiv="Access-Control-Allow-Origin" content="*" />
      </head>
      <RootLayoutClient className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </RootLayoutClient>
    </html>
  );
}
