import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { rootMetadata } from "#/configs/root-metadata";
import { API_ENDPOINTS } from "#/constant/api";
import SWRProvider from "#/libs/swr/swr-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const userResponse = { user: null }

  const fallback = {
    [API_ENDPOINTS.CURRENT_USER]: userResponse
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRProvider fallback={fallback}>
          {children}
        </SWRProvider>
      </body>
    </html>
  );
}

export const metadata = { ...rootMetadata }
