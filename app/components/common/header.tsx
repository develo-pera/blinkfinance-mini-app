import Image from "next/image";
import { ModeToggle } from "./toggle-mode";
import { cn } from "@/lib/utils";
import { Loader } from "./loader";

const Header = ({ className, loadingState }: { className?: string, loadingState?: boolean }) => {
  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between">
        {loadingState ?
          <Loader className="rounded-sm w-[42px] h-[42px]" /> :
          <Image className="rounded-sm" src="/miniapp-logo.jpg" alt="Mini App Logo" width={42} height={42} priority />
        }
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;