import Image from "next/image";
import { config } from "@/app.config";
import { Button } from "@/components/ui/button";

const LaunchMiniAppScreen = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Image className="rounded-sm" src="/miniapp-logo.jpg" alt="Mini App Logo" width={60} height={60} priority />
      <p className="mt-10 mb-5 text-sm text-center max-w-[300px]">Please go to Blink Finance Mini App to continue using the app</p>
      <Button className="mt-5 w-[250px]" asChild>
        <a href={config.baseAppUrl}>
          Open in <Image src="/Base_basemark_black.svg" alt="Base Logo" width={40} height={40} priority /> app
        </a>
      </Button>
      <Button className="mt-5 w-[250px]" asChild>
        <a href={config.farcasterAppUrl}>
          Open in <Image src="/farcaster-logo.svg" alt="Farcaster Logo" width={72} height={72} priority />
        </a>
      </Button>
    </div>
  );
};

export default LaunchMiniAppScreen;