"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAuthenticate, useMiniKit, useQuickAuth } from "@coinbase/onchainkit/minikit";
// import { useQuickAuth } from "@coinbase/onchainkit/minikit";
import styles from "./page.module.css";
import { ModeToggle } from "./components/common/toggle-mode";
import { Connected } from "@coinbase/onchainkit";
import Test from "./components/common/test";

interface AuthResponse {
  success: boolean;
  user?: {
    fid: number; // FID is the unique identifier for the user
    issuedAt?: number;
    expiresAt?: number;
  };
  message?: string; // Error messages come as 'message' not 'error'
}

export default function Home() {
  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `useMiniKit().context?.user`.
  // const { data, isLoading, error } = useQuickAuth<{
  //   userFid: string;
  // }>("/api/auth");

  const { context, setMiniAppReady, isMiniAppReady } = useMiniKit();
  const { signIn } = useAuthenticate();

  const { data: authData, isLoading: isAuthLoading, error: authError } = useQuickAuth<AuthResponse>(
    "/api/auth",
    { method: "GET" }
  );

  console.log("authData", authData);
  console.log("isAuthLoading", isAuthLoading);
  console.log("authError", authError);

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  // console.log("context", context);
  // console.log("contex client fid", context?.client.clientFid);


  return (
    <div className={styles.container}>
      <Connected
        fallback={
          <>
            <p>Nisi konektovan</p>
            <Wallet />
          </>
        }
      >
        <div className={styles.content}>
          <p>
            Context user fid: {context?.user?.fid}
          </p>

          <button onClick={async () => {
            const result = await signIn();
            console.log("result", result);
          }}>Sign In</button>

          <header className={styles.headerWrapper}>
            <Wallet />
          </header>
          <Test />
          <Image
            priority
            src="/sphere.svg"
            alt="Sphere"
            width={200}
            height={200}
          />
          <h1 className={styles.title}>MiniKit</h1>

          <ModeToggle />
        </div>
      </Connected>

    </div>
  );
}
