"use client";

import { IUser } from "@/models/User";
import AccountStatusCard from "../common/account-status-card";
import { Button } from "@/components/ui/button";
import { ActivePage } from "@/app/page";
import SignInButton from "../common/sign-in-button";
import InvoiceList from "../common/invoice-list";
import { InvoiceType } from "@/models/Invoice";
import { FinancialData } from "@/app/page";

const HomePage = ({
  userData,
  financialData,
  setActivePage,
  refetchUser,
  isAuthenticated,
  invoices,
  isFetchingInvoices,
  balance,
  isFetchingBalance,
  refetchBalance,
  isFetchingFinancialData,
}: {
  userData?: IUser,
  financialData: FinancialData,
  setActivePage: (page: ActivePage) => void,
  refetchUser: () => void,
  isAuthenticated: boolean,
  invoices: InvoiceType[],
  isFetchingInvoices: boolean,
  balance: number
  isFetchingBalance: boolean,
  refetchBalance: () => void,
  isFetchingFinancialData: boolean,
}
) => {
  const getTotalInvoiceAmount = (): number => {
    return invoices?.reduce((acc, invoice) => acc + invoice.totalAmount, 0) || 0;
  }

  return (
    <div className="flex flex-col flex-1">
      {/* <div className="bg-[var(--bf-light-green)] dark:bg-[#c181d8] mt-[-1px]"> */}
      <div>
        <div className="px-4 pt-5 pb-7">
          <AccountStatusCard
            name={userData?.displayName || ""}
            financialData={financialData}
            totalInvoiceAmount={getTotalInvoiceAmount()}
            balance={balance}
            refetchBalance={refetchBalance}
            isFetchingBalance={isFetchingBalance}
            isFetchingInvoices={isFetchingInvoices}
            isFetchingFinancialData={isFetchingFinancialData}
          />
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
        <InvoiceList invoices={invoices} isFetchingInvoices={isFetchingInvoices} setActivePage={setActivePage} isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
};

export default HomePage;