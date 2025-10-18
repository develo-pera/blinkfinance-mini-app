"use client";
import { useEffect } from "react";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useQuickAuth } from "@coinbase/onchainkit/minikit";
import { Connected } from "@coinbase/onchainkit";
import { config } from "@/app.config";
import LoadingAppScreen from "./components/loadingAppScreen";
import LaunchMiniAppScreen from "./components/launchMiniAppScreen";
import useIsMiniApp from "./hooks/useIsMiniApp";

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
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();

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

            <p className="mt-10 mb-5 text-sm">Please connect your wallet to continue</p>
            <ConnectWallet />
          </div>
        }
      >
        <div>
          <Wallet />
        </div>
      </Connected>
    </div>
  );
}
