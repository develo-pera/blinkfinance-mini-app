import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

const useIsMiniApp = () => {
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    sdk.isInMiniApp().then((isInMiniApp) => {
      setIsInMiniApp(isInMiniApp);
      setIsLoading(false);
    });
  }, []);

  return { isInMiniApp, isLoading };
};

export default useIsMiniApp; 