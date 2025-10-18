// This hook is used to check if the app is in a mini app context.
// We use custom hook because the useIsInMiniApp hook from @coinbase/onchainkit/minikit is not working.
// @todo: add tanstack query to this hook.

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