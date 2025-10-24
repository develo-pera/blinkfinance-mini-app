"use client";

import { IUser } from "@/models/User";
import AccountStatusCard from "../common/account-status-card";
import { Button } from "@/components/ui/button";
import { ActivePage } from "@/app/page";
import SignInButton from "../common/sign-in-button";
import InvoiceList from "../common/invoice-list";
import { InvoiceType } from "../common/invoice-card";
import { FinancialData } from "@/app/page";

const HomePage = ({
  userData,
  financialData,
  setActivePage,
  refetchUser,
  isAuthenticated,
  invoices
}: {
  userData?: IUser,
  financialData: FinancialData,
  setActivePage: (page: ActivePage) => void,
  refetchUser: () => void
  isAuthenticated: boolean
  invoices: InvoiceType[]
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
      <div className="mt-5">
        {
          isAuthenticated ? (
            <InvoiceList invoices={invoices} setActivePage={setActivePage} />
          ) : (
            <div className="mt-5 bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)] rounded-xl p-4 relative overflow-hidden">
              <div className="relative z-1">
                <p className="opacity-80">Please sign in to view your invoices</p>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default HomePage;