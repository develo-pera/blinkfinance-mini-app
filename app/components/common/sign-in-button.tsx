"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Signature, SignatureButton } from "@coinbase/onchainkit/signature";

const SignInButton = ({ refetchUser, className }: { refetchUser: () => void, className?: string }) => {
  const { address } = useAccount();
  const { signMessage } = useSignMessage();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);

    const response = await fetch("/api/auth/nonce");
    const result = await response.json();
    if (!result.success) {
      setIsSigningIn(false);
      toast.error("Sign in failed");
      throw new Error(result.error || "Failed to generate nonce");
    }
    const nonce = result.data;

    const message = {
      nonce: nonce,
      walletAddress: address as `0x${string}`,
      domain: process.env.NEXT_PUBLIC_URL || "localhost:3000",
    };

    signMessage({ message: JSON.stringify(message) }, {
      onSuccess: async (signature) => {
        try {
          const authResponse = await fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify({ walletAddress: address, signature, message }),
          });
          const authResult = await authResponse.json();
          if (!authResult.success) {
            throw new Error(authResult.error || "Failed to sign in");
          }
          localStorage.setItem("bf-token", authResult.token);
          refetchUser();
        } catch (error) {
          toast.error("Failed to sign in");
          return error;
        }
        setIsSigningIn(false);
      },
      onError: (_error) => {
        toast.error("Failed to sign in");
        setIsSigningIn(false);
      },
    });
  };

  return (
    <>
      <Signature
        message="Moja poruka"
      >
        <SignatureButton
          render={({ onClick }: { onClick: () => void }) => (
            <Button onClick={onClick}>Sign with base</Button>
          )}
        />
      </Signature>

      <Button onClick={handleSignIn} disabled={isSigningIn} className={cn("mt-2 w-full rounded-xl bg-[var(--bf-card-background)] text-foreground", className)}>
        {isSigningIn ? "Signing in..." : "Please sign in to use the app"}
      </Button>
    </>
  );
};

export default SignInButton;