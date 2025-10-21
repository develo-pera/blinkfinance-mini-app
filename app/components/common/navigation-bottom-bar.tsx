import { cn } from "@/lib/utils";
import { Context } from "@farcaster/miniapp-sdk";
import { Address } from "viem";
import { ReceiptText, SquarePlus, Wallet } from "lucide-react";
import UserAvatar from "./user-avatar";
import { ActivePage } from "@/app/page";

const NavigationBottomBar = ({ className, user, address, setActivePage }: { className?: string, user?: Context.UserContext, address?: Address, setActivePage: (page: ActivePage) => void }) => {
  return (
    <div className={cn("px-2 py-4 fixed bottom-0 left-0 right-0 z-50", className)}>
      <div className="flex items-center justify-between gap-10 p-4 py-3 dark:bg-[#131313] bg-[#f5f5f5] rounded-sm">
        <div onClick={() => setActivePage("home")} className="flex items-center justify-center">
          <ReceiptText className="w-6 h-6 text-foreground stroke-[1.5px] opacity-70" />
        </div>
        <div onClick={() => setActivePage("upload")} className="flex items-center justify-center">
          <SquarePlus className="w-6 h-6 text-foreground stroke-[1.5px] opacity-70" />
        </div>
        <div onClick={() => setActivePage("wallet")} className="flex items-center justify-center">
          <Wallet className="w-6 h-6 text-foreground stroke-[1.5px] opacity-70" />
        </div>
        <div onClick={() => setActivePage("profile")} className="flex items-center justify-center">
          <UserAvatar onClick={() => { console.log("Click Avatar") }} user={user} address={address} />
        </div>
      </div>
    </div>
  );
};

export default NavigationBottomBar;