import Image from "next/image";
import { ModeToggle } from "./toggle-mode";

const Navigation = () => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <Image src="/miniapp-logo.jpg" alt="Mini App Logo" width={42} height={42} priority />
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navigation;