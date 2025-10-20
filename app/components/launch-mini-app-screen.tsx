"use client"

import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { config } from "@/app.config";
import { Button } from "@/components/ui/button";
import ModeImage from "./common/mode-image";
import CONSTANTS from "@/lib/consts";

interface LaunchMiniAppScreenProps {
  enableDemo: Dispatch<SetStateAction<boolean>>;
}

const LaunchMiniAppScreen = ({ enableDemo }: LaunchMiniAppScreenProps) => {
  const setAllowDemo = () => {
    localStorage.setItem(CONSTANTS.localStorageKeys.BFAllowDemo, "true");
    enableDemo(true);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Image className="rounded-sm" src="/miniapp-logo.jpg" alt="Mini App Logo" width={60} height={60} priority />
      <p className="mt-10 mb-5 text-sm text-center max-w-[300px]">Please go to Blink Finance Mini App to continue using the app</p>
      <Button className="mt-5 w-[250px]" asChild>
        <a href={config.baseAppUrl}>
          Open in <ModeImage srcLight="/Base_basemark_white.svg" srcDark="/Base_basemark_black.svg" alt="Base Logo" width={40} height={40} priority /> app
        </a>
      </Button>
      <Button className="mt-2 w-[250px]" asChild>
        <a href={config.farcasterAppUrl}>
          Open in <Image src="/farcaster-logo.svg" alt="Farcaster Logo" width={72} height={72} priority />
        </a>
      </Button>

      {
        config.allowDemo && (
          <div className="mt-10 text-center max-w-[250px] mx-auto border-t border-border pt-8">
            <p className="text-sm">Or if you promise to be Base Batches judge you can proceed within the app in the browser as well to demo it.</p>
            <Button className="mt-7 w-[250px]" onClick={setAllowDemo}>
              I'm a Base Batches judge, let me in
            </Button>
            <p className="text-xs mt-2">Allow demo functionality will be removed after Nov 17.</p>
          </div>
        )
      }
    </div>
  );
};

export default LaunchMiniAppScreen;