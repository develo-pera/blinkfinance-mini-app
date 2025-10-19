"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";
import TanstackQueryProvider from "./components/providers/tanstack-query-provider";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "hacker",
        },
        wallet: {
          display: "modal",
          preference: "all",
        },
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
      </TanstackQueryProvider>
    </OnchainKitProvider>
  );
}
