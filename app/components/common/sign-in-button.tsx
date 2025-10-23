"use client";

import { useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { generateSiweNonce } from "viem/siwe";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SignInButton = ({ refetchUser, className }: { refetchUser: () => void, className?: string }) => {
  const { address } = useAccount();
  const { signTypedData } = useSignTypedData();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // todo:
  const nonce = generateSiweNonce();

  const message = {
    nonce,
    walletAddress: address as `0x${string}`,
    domain: process.env.NEXT_PUBLIC_URL || "localhost:3000",
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);

    // TODO: Change to SIWE
    signTypedData({
      types: {
        EIP712Domain: [],
        Attest: [{ name: "nonce", type: "string" }, { name: "walletAddress", type: "address" }, { name: "domain", type: "string" }],
      },
      primaryType: "Attest",
      domain: {},
      message,
    }, {
      onSuccess: async (signature) => {
        try {
          const response = await fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify({
              walletAddress: address,
              signature,
              message,
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to sign in");
          }
          const data = await response.json();
          localStorage.setItem("bf-token", data.token);
          refetchUser();
        } catch (error) {
          console.error(error);
          toast.error("Failed to sign in");
        }
        setIsSigningIn(false);
      },
      onError: (error) => {
        console.error(error);
        setIsSigningIn(false);
      }
    });
  };

  return (
    <>
      <Button onClick={handleSignIn} disabled={isSigningIn} className={cn("mt-2 w-full rounded-xl bg-[var(--bf-card-background)] text-foreground", className)}>
        {isSigningIn ? "Signing in..." : "Please sign in to use the app"}
      </Button>
    </>
  );
};

export default SignInButton;