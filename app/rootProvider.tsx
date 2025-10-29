"use client";
import { ReactNode } from "react";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";
import TanstackQueryProvider from "./components/providers/tanstack-query-provider";
import { Toaster } from "@/components/ui/sonner";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        appearance: {
          mode: "auto",
          theme: "hacker",
        },
        wallet: {
          display: "modal",
          preference: "all",
        },
        paymaster: process.env.NEXT_PUBLIC_PAYMASTER_URL,
        analytics: false,
      }}
      miniKit={{
        enabled: true,
        autoConnect: true,
        // TODO: revisit this
        notificationProxyUrl: undefined,
      }}
    >
      <TanstackQueryProvider>
        {children}
        <Toaster />
      </TanstackQueryProvider>
    </OnchainKitProvider>
  );
}
