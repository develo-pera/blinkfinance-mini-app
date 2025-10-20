import { cn } from "@/lib/utils";
import { Context } from "@farcaster/miniapp-sdk";
import { Address } from "viem";
import UserAvatar from "./user-avatar";

const NavigationBottomBar = ({ className, user, address }: { className?: string, user?: Context.UserContext, address?: Address }) => {
  return (
    <div className={cn("px-2 py-4 fixed bottom-0 left-0 right-0 border-t border-border", className)}>
      <div className="grid grid-cols-3 items-center gap-10">
        <div />

        <div />
        <div className="flex items-center justify-center">
          <UserAvatar onClick={() => { console.log("Click Avatar") }} user={user} address={address} />
        </div>
      </div>
    </div>
  );
};

export default NavigationBottomBar;