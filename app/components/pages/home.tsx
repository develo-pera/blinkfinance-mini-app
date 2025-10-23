"use client";

import { IUser } from "@/models/User";
import AccountStatusCard from "../common/account-status-card";
import { Button } from "@/components/ui/button";
import { ActivePage } from "@/app/page";
import SignInButton from "../common/sign-in-button";

const HomePage = ({
  userData,
  financialData,
  setActivePage,
  refetchUser,
  isAuthenticated
}: {
  userData?: IUser,
  financialData?: { totalAmount: number, totalRepaid: number, totalBorrowed: number },
  setActivePage: (page: ActivePage) => void,
  refetchUser: () => void
  isAuthenticated: boolean
}
) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)] mt-[-1px]">
        <div className="px-4 pt-5 pb-7">
          <AccountStatusCard name={userData?.displayName || ""} financialData={financialData} />
          {
            isAuthenticated ? (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button onClick={() => setActivePage("borrow")} className={"w-full rounded-xl bg-[var(--bf-card-background)] text-foreground"}>
                  Borrow
                </Button>
                <Button onClick={() => setActivePage("repay")} className={"w-full rounded-xl bg-[var(--bf-card-background)] text-foreground"}>
                  Repay
                </Button>
              </div>
            ) : (
              <SignInButton refetchUser={refetchUser} />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default HomePage;