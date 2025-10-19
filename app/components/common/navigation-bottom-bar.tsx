import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { cn } from "@/lib/utils";

const NavigationBottomBar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("px-4 py-6 fixed bottom-0 left-0 right-0 border-t border-border", className)}>

    </div>
  );
};

export default NavigationBottomBar;