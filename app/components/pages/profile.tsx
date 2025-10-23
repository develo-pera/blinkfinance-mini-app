"use client";

import { Button } from "@/components/ui/button";
import { Context } from "@farcaster/miniapp-sdk";
import { Building2, LogOut, Pencil } from "lucide-react";
import { useDisconnect } from "wagmi";
import { Address, Chain } from "viem";
import { useName } from "@coinbase/onchainkit/identity";
import { base, mainnet } from "wagmi/chains";
import { cn, truncateAddress } from "@/lib/utils";
import { IUser } from "@/models/User";
import { ICompany } from "@/models/Company";
import { ActivePage } from "@/app/page";
import CompanyCard from "../common/company-card";
import SignInButton from "../common/sign-in-button";

// Move to separate file.
const ProfilePageEditButtons = ({ profileCompleted, setActivePage, company }: { profileCompleted: string, setActivePage: (page: ActivePage) => void, company: ICompany }) => {
  if (profileCompleted) {
    return (
      <div className="mt-auto grid grid-cols-2 gap-5">
        <Button onClick={() => setActivePage("edit-profile")} className=" w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">
          <Pencil className="w-4h-4" /> Edit profile
        </Button>

        <Button onClick={() => setActivePage("edit-company")} className="w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">
          <Building2 className="w-4h-4" /> {company ? "Edit" : "Create"} Company
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => setActivePage("complete-profile")} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">
      <Pencil className="w-4h-4" /> Complete profile
    </Button>
  )
}

const ProfilePage = ({
  userData,
  user,
  address,
  company,
  setActivePage,
  isAuthenticated,
  refetchUser
}: {
  userData?: IUser,
  user?: Context.UserContext,
  address?: Address,
  company?: ICompany,
  setActivePage: (page: ActivePage) => void,
  isAuthenticated: boolean, refetchUser: () => void
}) => {
  const { disconnect } = useDisconnect();
  const { data: ensName, isLoading: isEnsNameLoading } = useName({ address: address as `0x${string}`, chain: mainnet as Chain });
  const { data: baseEnsName, isLoading: isBaseEnsNameLoading } = useName({ address: address as `0x${string}`, chain: base as Chain });

  const displayDomain = ensName || baseEnsName;

  // TODO: if data is loading, show skeleton loader.

  console.log("isEnsNameLoading", isEnsNameLoading);
  console.log("isBaseEnsNameLoading", isBaseEnsNameLoading);

  // TODO: add user name from userData
  const userName = userData?.displayName || user?.displayName;
  const profileCompleted = userName && userData?.email;

  const onLogout = () => {
    localStorage.removeItem("bf-token");
    disconnect();
    setActivePage("home");
  };

  return (
    <div className="px-4 flex flex-col flex-1">
      <div className="mt-5 px-4">
        <h1 className={cn("text-2xl font-bold", userName ? "text-foreground" : "text-gray-500 opacity-50")}>{userName || "Name not set"}</h1>
        <p>{displayDomain || truncateAddress(address as Address)}</p>

        <p className={cn("text-sm", userData?.email ? "text-foreground" : "text-gray-500 opacity-50")}>{userData?.email || "Email not set"}</p>
      </div>

      {/* // TODO: check if userData has company data and show it */}
      <div className="my-10 p-4 bg-[var(--bf-card-background)] rounded-2xl">
        <h2 className="text-3xl">Your Company</h2>
        {
          company ? <CompanyCard company={company} />
            : (
              <div className="mt-5 bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)] rounded-xl p-4 relative overflow-hidden">
                <div className="relative z-1">
                  <p className="opacity-80">No company found. {isAuthenticated ? "Please create one to start using Blink Finance" : "Please sign in to create one"}.</p>
                </div>
              </div>
            )
        }
      </div>
      {
        !isAuthenticated && (
          <SignInButton refetchUser={refetchUser} className="mt-auto" />
        )
      }

      {
        isAuthenticated && <ProfilePageEditButtons profileCompleted={profileCompleted!} setActivePage={setActivePage} company={company!} />
      }

      <Button onClick={onLogout} className="mt-5 w-full rounded-xl">
        <LogOut className="w-4h-4" /> Log out
      </Button>
    </div >
  );
};

export default ProfilePage;