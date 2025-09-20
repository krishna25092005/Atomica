"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/style.css";
import React, { useEffect, useState, useMemo } from "react";
import Loader from "@/components/common/Loader";
import Script from "next/script";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/app/context/UserContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Memoize the Ably client to prevent recreation on every render
  const client = useMemo(() => new Ably.Realtime({
    key: "L-u5Lw.3Q624A:Q8c0OHqRd4ZEdCbrKaJGetcwTXVbBgNAoaUMQBkPQjo",
  }), []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {/* Load RDKit script with Next.js Script component */}
        <Script 
          src="https://unpkg.com/@rdkit/rdkit/dist/RDKit_minimal.js"
          strategy="beforeInteractive"
        />
        
        <SessionProvider>
          <UserProvider>
            <AblyProvider client={client}>
              <ChannelProvider channelName="chat-demo1">
                <div className="font-poppins dark:bg-boxdark-2 dark:text-bodydark ">
                  {loading ? <Loader /> : children}
                </div>
              </ChannelProvider>
            </AblyProvider>
          </UserProvider>
        </SessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
