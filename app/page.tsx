"use client";
import { useEffect } from "react";
import Image from "next/image";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useQuickAuth } from "@coinbase/onchainkit/minikit";
import { Connected } from "@coinbase/onchainkit";
import { config } from "@/app.config";
import LoadingAppScreen from "./components/loading-app-screen";
import LaunchMiniAppScreen from "./components/launch-mini-app-screen";
import useIsMiniApp from "./hooks/useIsMiniApp";
import Navigation from "./components/common/navigation";
import NavigationBottomBar from "./components/common/navigation-bottom-bar";

export default function Home() {
  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `useMiniKit().context?.user`.
  // const { data, isLoading, error } = useQuickAuth<{
  //   userFid: string;
  // }>("/api/auth");

  const { isInMiniApp, isLoading: isInMiniAppLoading } = useIsMiniApp();
  const { context, setMiniAppReady, isMiniAppReady } = useMiniKit();

  console.log("context", context);

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  if (isInMiniAppLoading || !isMiniAppReady) {
    return <LoadingAppScreen />;
  }


  if (!isInMiniApp && config.onlyMiniApp) {
    return <LaunchMiniAppScreen />;
  }

  return (
    <div>
      <Connected
        fallback={
          <div className="h-screen flex flex-col items-center justify-center">
            <Image className="rounded-sm" src="/miniapp-logo.jpg" alt="Mini App Logo" width={60} height={60} priority />
            <p className="mt-10 mb-5 text-sm text-center">Please connect your wallet to continue using Blink Finance Mini App</p>
            {/* TODO: this doesn't work for Farcaster. Try with custom connect wallet button. */}
            <ConnectWallet className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
          </div>
        }
      >
        <div className="min-h-screen h-[3000px]">
          <Navigation />

          <NavigationBottomBar />
        </div>
      </Connected>
    </div>
  );
}
