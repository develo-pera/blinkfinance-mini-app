import Image from "next/image";
import { config } from "@/app.config";
import { Button } from "@/components/ui/button";

const LaunchMiniAppScreen = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Image className="rounded-sm" src="/miniapp-logo.jpg" alt="Mini App Logo" width={60} height={60} priority />
      <p className="mt-10 mb-5 text-sm">Please open Blink Finance Mini App to continue</p>
      <Button className="mt-5" asChild>
        <a href={config.baseAppUrl}>
          Launch Mini App in Base App
        </a>
      </Button>
      <Button className="mt-5" asChild>
        <a href={config.farcasterAppUrl}>
          Launch Mini App in Farcaster
        </a>
      </Button>
    </div>
  );
};

export default LaunchMiniAppScreen;