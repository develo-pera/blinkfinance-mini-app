"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useQuickAuth } from "@coinbase/onchainkit/minikit";
import { Connected } from "@coinbase/onchainkit";
import { config } from "@/app.config";
import CONSTANTS from "@/lib/consts";
import LoadingAppScreen from "./components/loading-app-screen";
import LaunchMiniAppScreen from "./components/launch-mini-app-screen";
import useIsMiniApp from "./hooks/useIsMiniApp";
import Header from "./components/common/header";
import NavigationBottomBar from "./components/common/navigation-bottom-bar";
import Onboarding from "./components/onboarding";
import HomePage from "./components/pages/home";
import UploadPage from "./components/pages/upload";
import WalletPage from "./components/pages/wallet";
import ProfilePage from "./components/pages/profile";

export type ActivePage = "home" | "upload" | "wallet" | "profile";

export default function Home() {
  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `useMiniKit().context?.user`.
  // const { data, isLoading: isQuickAuthLoading, error } = useQuickAuth<{
  //   userFid: string;
  // }>("/api/auth");
  const [allowDemo, setAllowDemo] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isInMiniApp, isLoading: isInMiniAppLoading } = useIsMiniApp();
  const { context, setMiniAppReady, isMiniAppReady } = useMiniKit();
  const { address } = useAccount();
  const [activePage, setActivePage] = useState<ActivePage>("home");

  console.log("context", context);
  // console.log("data", data);
  // console.log("error", error);

  useEffect(() => {
    const allowDemo = localStorage.getItem(CONSTANTS.localStorageKeys.BFAllowDemo);
    if (allowDemo === "true") {
      setAllowDemo(true);
    }

    // TODO: This should be stored in a database for each user.
    const onboadingCompleted = localStorage.getItem(CONSTANTS.localStorageKeys.BFOnboadingCompleted);
    if (!onboadingCompleted) {
      setShowOnboarding(true);
    }

    // Only load Eruda in development and not on localhost
    if (typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'development' &&
      !window.location.hostname.includes('localhost')) {
      import('eruda').then((eruda) => eruda.default.init());
    }
  }, []);

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  if (isInMiniAppLoading || !isMiniAppReady) {
    return <LoadingAppScreen />;
  }

  const demoEnabled = allowDemo && config.allowDemo;
  if (!isInMiniApp && config.onlyMiniApp && !demoEnabled) {
    return <LaunchMiniAppScreen enableDemo={setAllowDemo} />;
  }

  if (showOnboarding) {
    return <Onboarding setShowOnboarding={setShowOnboarding} />;
  }

  return (
    <div>
      <Connected
        fallback={
          <div className="h-screen flex flex-col items-center justify-center">
            <Image className="rounded-sm" src="/miniapp-logo.jpg" alt="Mini App Logo" width={60} height={60} priority />
            <p className="mt-10 mb-5 text-sm text-center max-w-[250px]">Please connect your wallet to continue using Blink Finance Mini App</p>
            {/* TODO: this doesn't work for Farcaster. Try with custom connect wallet button. */}
            <ConnectWallet onConnect={() => console.log("connected BREE!")} className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
          </div>
        }
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex flex-1 pb-[90px]">
            {activePage === "home" && <HomePage />}
            {activePage === "upload" && <UploadPage />}
            {activePage === "wallet" && <WalletPage />}
            {activePage === "profile" && <ProfilePage user={context?.user} address={address} />}
          </div>
          {/* TODO: Remove mx-auto max-w-screen-md after demo is disabled. App will be available only as Mini App. */}
          <NavigationBottomBar setActivePage={setActivePage} activePage={activePage} className="mx-auto max-w-screen-sm" user={context?.user} address={address} />
        </div>
      </Connected>
    </div>
  );
}
