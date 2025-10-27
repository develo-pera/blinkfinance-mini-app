"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useQuickAuth } from "@coinbase/onchainkit/minikit";
import { Connected } from "@coinbase/onchainkit";
import { config } from "@/app.config";
import CONSTANTS from "@/lib/consts";
import useFetchUser from "./hooks/useFetchUser";
import useFetchCompany from "./hooks/useFetchCompany";
import LoadingAppScreen from "./components/loading-app-screen";
import LaunchMiniAppScreen from "./components/launch-mini-app-screen";
import useIsMiniApp from "./hooks/useIsMiniApp";
import Header from "./components/common/header";
import NavigationBottomBar from "./components/common/navigation-bottom-bar";
import Onboarding from "./components/onboarding";
import HomePage from "./components/pages/home";
import UploadPage from "./components/pages/upload";
import WalletPage from "./components/pages/wallet";
import ProfilePage from "./components/pages/profile";
import CompleteProfilePage from "./components/pages/complete-profile";
import EditProfilePage from "./components/pages/edit-profile";
import EditCompanyPage from "./components/pages/edit-company";
import BorrowRepayPage from "./components/pages/borrow-repay";
import useFetchMockStabelcoinBalance from "./hooks/useFetchMockStabelcoinBalance";
import { formatUnits } from "viem";
import useFetchInvoices from "./hooks/useFetchInvoices";
import useFetchFinancialData from "./hooks/useFetchFinancialData";
// import { Button } from "@/components/ui/button";

export type ActivePage = "home" | "upload" | "wallet" | "profile" | "complete-profile" | "edit-profile" | "edit-company" | "borrow" | "repay";

const applyClassOnHeader = (activePage: ActivePage) => {
  switch (activePage) {
    case "home":
      return "bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)]";
    default:
      return "";
  }
}

export type FinancialData = {
  totalApprovedAmount: number;
  totalRepaidAmount: number;
  totalBorrowedAmount: number;
}

export default function Home() {
  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `useMiniKit().context?.user`.
  // const { data, isLoading: isQuickAuthLoading, error } = useQuickAuth<{
  //   userFid: string;
  // }>("/api/auth");
  const [allowDemo, setAllowDemo] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isInMiniApp, isLoading: isInMiniAppLoading } = useIsMiniApp();
  const { context, setMiniAppReady, isMiniAppReady } = useMiniKit();
  const { address } = useAccount();
  const { data: userData, isLoading: isFetchingUser, error: _fetchUserError, refetch: refetchUser } = useFetchUser(address);
  const { data: companyData, isLoading: isFetchingCompany, error: _fetchCompanyError, refetch: refetchCompany } = useFetchCompany(userData?.id);
  const { data: invoices, isLoading: isFetchingInvoices, error: _fetchInvoicesError, refetch: refetchInvoices } = useFetchInvoices(userData?.id);
  const { data: financialData, isFetching: isFetchingFinancialData, isRefetching: isRefetchingFinancialData, error: _fetchFinancialDataError, refetch: refetchFinancialData } = useFetchFinancialData(userData?.walletAddress);
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const { data: balance, isFetching: isBalanceLoading, refetch: refetchBalance } = useFetchMockStabelcoinBalance(address);

  console.log("context", context);
  console.log("userData", userData);

  console.log("isFetchingFinancialData", isFetchingFinancialData);
  console.log("isRefetchingFinancialData", isRefetchingFinancialData);

  const userName = userData?.displayName || context?.user?.displayName;
  const profileCompleted = userName && userData?.email;

  console.log("invoices", invoices);
  // console.log("error", error);

  const isAuthenticated = typeof window !== 'undefined' ? !!localStorage?.getItem("bf-token") : false;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const allowDemo = localStorage.getItem(CONSTANTS.localStorageKeys.BFAllowDemo);
    if (allowDemo === "true") {
      setAllowDemo(true);
    }

    // TODO: This should be stored in a database for each user.
    const onboadingCompleted = localStorage.getItem(CONSTANTS.localStorageKeys.BFOnboadingCompleted);
    if (!onboadingCompleted) {
      setShowOnboarding(true);
    }

    // Only load Eruda in development and not on localhost
    if (typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'development' &&
      !window.location.hostname.includes('localhost')) {
      import('eruda').then((eruda) => eruda.default.init());
    }
  }, []);

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  if (isInMiniAppLoading || !isMiniAppReady || isFetchingUser) {
    return <LoadingAppScreen />;
  }

  const demoEnabled = allowDemo && config.allowDemo;
  if (!isInMiniApp && config.onlyMiniApp && !demoEnabled) {
    return <LaunchMiniAppScreen enableDemo={setAllowDemo} />;
  }

  if (showOnboarding) {
    return <Onboarding setShowOnboarding={setShowOnboarding} />;
  }

  return (
    <div>
      <Connected
        // connecting={
        //   <LoadingAppScreen />
        // }
        fallback={
          <div className="h-screen flex flex-col items-center justify-center">
            <Image className="rounded-sm" src="/miniapp-logo.jpg" alt="Mini App Logo" width={60} height={60} priority />
            <p className="mt-10 mb-5 text-sm text-center max-w-[250px]">Please connect your wallet to continue using Blink Finance Mini App</p>
            {/* TODO: this doesn't work for Farcaster. Try with custom connect wallet button. */}
            <ConnectWallet className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
          </div>
        }
      >
        <div className="min-h-screen flex flex-col">
          <Header className={applyClassOnHeader(activePage)} loadingState={loadingState} />
          {/* <Button onClick={() => refetchFinancialData()}>Refetch Financial Data</Button> */}
          <div className="flex flex-1 pb-[90px]">
            {/* TODO: add financial data here from the smart contract. */}
            {
              activePage === "home" &&
              <HomePage
                userData={userData}
                financialData={financialData}
                balance={Number(formatUnits(balance?.value || BigInt(0), 6))}
                setActivePage={setActivePage}
                refetchUser={refetchUser}
                isAuthenticated={isAuthenticated}
                invoices={invoices}
                isFetchingInvoices={isFetchingInvoices}
                refetchBalance={refetchBalance}
                isFetchingBalance={isBalanceLoading}
                isFetchingFinancialData={isFetchingFinancialData}
              />}
            {
              (activePage === "borrow" || activePage === "repay") &&
              <BorrowRepayPage
                financialData={financialData}
                activePage={activePage}
                setActivePage={setActivePage}
                refetchBalance={refetchBalance}
                refetchFinancialData={refetchFinancialData}
                isFetchingFinancialData={isFetchingFinancialData}
              />
            }
            {
              activePage === "upload" &&
              <UploadPage
                refetchInvoices={refetchInvoices}
                setActivePage={setActivePage}
                setLoadingState={setLoadingState}
                isAuthenticated={isAuthenticated}
                refetchUser={refetchUser}
                profileCompleted={profileCompleted}
                refetchFinancialData={refetchFinancialData}
              />
            }
            {activePage === "wallet" && <WalletPage />}
            {
              activePage === "profile" &&
              <ProfilePage
                userData={userData}
                user={context?.user}
                address={address}
                company={companyData}
                setActivePage={setActivePage}
                isAuthenticated={isAuthenticated}
                refetchUser={refetchUser} />}
            {
              activePage === "complete-profile" &&
              <CompleteProfilePage
                user={context?.user}
                userData={userData}
                address={address}
                setLoadingState={setLoadingState}
                refetchUser={refetchUser}
                setActivePage={setActivePage}
              />
            }
            {
              activePage === "edit-profile" &&
              <EditProfilePage
                userData={userData}
                setLoadingState={setLoadingState}
                refetchUser={refetchUser}
                setActivePage={setActivePage}
              />
            }
            {
              activePage === "edit-company" &&
              <EditCompanyPage
                userData={userData}
                companyData={companyData}
                setLoadingState={setLoadingState}
                refetchCompany={refetchCompany}
                setActivePage={setActivePage}
              />
            }
          </div>
          {/* TODO: Remove mx-auto max-w-screen-md after demo is disabled. App will be available only as Mini App. */}
          <NavigationBottomBar className="mx-auto max-w-screen-sm" setActivePage={setActivePage} activePage={activePage} user={context?.user} address={address} />
        </div>
      </Connected>
    </div>
  );
}
