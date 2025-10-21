import Image from "next/image";
import { ModeToggle } from "./toggle-mode";
import { cn } from "@/lib/utils";

const Header = ({ className }: { className?: string }) => {
  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between">
        <Image src="/miniapp-logo.jpg" alt="Mini App Logo" width={42} height={42} priority />
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;