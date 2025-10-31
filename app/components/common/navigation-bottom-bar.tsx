import { cn } from "@/lib/utils";
import { Context } from "@farcaster/miniapp-sdk";
import { Address } from "viem";
import { ArrowDownUp, ReceiptText, ScanFace, SquarePlus, Wallet } from "lucide-react";
import UserAvatar from "./user-avatar";
import { ActivePage } from "@/app/page";
import { useEffect, useRef } from "react";
import { useIsVirtualKeyboardOpen } from "@/app/hooks/useKeyboardDetection";

const NavigationBottomBar = ({ className, user, address, setActivePage, activePage }: { className?: string, user?: Context.UserContext, address?: Address, setActivePage: (page: ActivePage) => void, activePage: ActivePage }) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const borrowRef = useRef<HTMLDivElement>(null);
  const { isVirtualKeyboardOpen } = useIsVirtualKeyboardOpen();

  const updateIndicatorPosition = () => {
    if (!indicatorRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let targetElement: HTMLDivElement | null = null;

    switch (activePage) {
      case "home":
        targetElement = homeRef.current;
        break;
      case "borrow":
        targetElement = borrowRef.current;
        break;
      case "upload":
        targetElement = uploadRef.current;
        break;
      case "wallet":
        targetElement = walletRef.current;
        break;
      case "profile":
        targetElement = profileRef.current;
        break;
      default:
        return;
    }

    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();

      // Calculate the center of the target element relative to the container
      const targetCenterX = targetRect.left - containerRect.left + (targetRect.width / 2);
      const targetCenterY = targetRect.top - containerRect.top + (targetRect.height / 2);

      indicatorRef.current.style.left = `${targetCenterX}px`;
      indicatorRef.current.style.top = `${targetCenterY}px`;
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      updateIndicatorPosition();
    }, 0);

    // Update position on window resize
    const handleResize = () => updateIndicatorPosition();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [activePage]);

  const handlePageClick = (page: ActivePage) => {
    setActivePage(page);
  };

  const showAnimatedIndicator = activePage === "home" || activePage === "upload" || activePage === "wallet" || activePage === "profile" || activePage === "borrow";

  // Don't render if keyboard is open
  if (isVirtualKeyboardOpen) {
    return null;
  }

  return (
    <div className={cn("px-4 py-4 fixed bottom-0 left-0 right-0 z-50", className)}>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-background to-transparent" />
      <div ref={containerRef} className="relative flex items-center justify-between gap-10 p-4 py-3 dark:bg-[#131313] bg-[#f5f5f5] rounded-xl">
        {/* Animated indicator */}
        {showAnimatedIndicator && <div
          ref={indicatorRef}
          className="absolute w-10 h-10 bg-[var(--bf-purple)] rounded-xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            transform: "translate(-50%, -50%)",
            zIndex: 1
          }}
        />}

        <div
          ref={homeRef}
          onClick={() => handlePageClick("home")}
          className="relative flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 z-10"
        >
          <ReceiptText
            className={cn(
              "w-6 h-6 stroke-[1.5px] transition-all duration-200",
              activePage === "home"
                ? "text-background opacity-100"
                : "text-foreground opacity-70"
            )}
          />
        </div>

        <div
          ref={borrowRef}
          onClick={() => handlePageClick("borrow")}
          className="relative flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 z-10"
        >
          <ArrowDownUp
            className={cn(
              "w-6 h-6 stroke-[1.5px] transition-all duration-200",
              activePage === "borrow"
                ? "text-background opacity-100"
                : "text-foreground opacity-70"
            )}
          />
        </div>

        <div
          ref={uploadRef}
          onClick={() => handlePageClick("upload")}
          className="relative flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 z-10"
        >
          <SquarePlus
            className={cn(
              "w-6 h-6 stroke-[1.5px] transition-all duration-200",
              activePage === "upload"
                ? "text-background opacity-100"
                : "text-foreground opacity-70"
            )}
          />
        </div>

        <div
          ref={walletRef}
          onClick={() => handlePageClick("wallet")}
          className="relative flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 z-10"
        >
          <Wallet
            className={cn(
              "w-6 h-6 stroke-[1.5px] transition-all duration-200",
              activePage === "wallet"
                ? "text-background opacity-100"
                : "text-foreground opacity-70"
            )}
          />
        </div>

        <div
          ref={profileRef}
          onClick={() => handlePageClick("profile")}
          className="relative flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 z-10"
        >
          <UserAvatar onClick={() => { console.log("Click Avatar") }} user={user} address={address}>
            <ScanFace
              className={cn(
                "w-6 h-6 stroke-[1.5px] transition-all duration-200",
                activePage === "profile"
                  ? "text-background opacity-100"
                  : "text-foreground opacity-70"
              )}
            />
          </UserAvatar>
        </div>
      </div>
    </div>
  );
};

export default NavigationBottomBar;