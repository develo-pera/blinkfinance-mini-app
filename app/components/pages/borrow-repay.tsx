"use client";

import { ActivePage, FinancialData } from "@/app/page";
import { Button } from "@/components/ui/button";
import BorrowPage from "../common/borrow";
import RepayPage from "../common/repay";

const BorrowRepayPage = ({
  activePage,
  isFetchingFinancialData,
  setActivePage,
  financialData,
  refetchBalance,
  refetchFinancialData,
}: {
  activePage: ActivePage,
  isFetchingFinancialData: boolean,
  setActivePage: (page: ActivePage) => void,
  financialData: FinancialData,
  refetchBalance: () => void,
  refetchFinancialData: () => void,
}) => {
  return (
    <div className="p-4 flex flex-col flex-1">
      <h1>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
      {
        activePage === "borrow" && (
          <BorrowPage
            availableToBorrow={financialData.totalApprovedAmount - financialData.totalBorrowedAmount}
            isFetchingFinancialData={isFetchingFinancialData}
            setActivePage={setActivePage}
            refetchBalance={refetchBalance}
            refetchFinancialData={refetchFinancialData}
          />
        )
      }
      {
        activePage === "repay" && (
          <RepayPage
            outstandingBorrowed={financialData.totalBorrowedAmount - financialData.totalRepaidAmount}
            setActivePage={setActivePage}
            refetchBalance={refetchBalance}
            refetchFinancialData={refetchFinancialData}
            isFetchingFinancialData={isFetchingFinancialData}
          />
        )
      }
      <Button onClick={() => setActivePage("home")} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Go back</Button>
    </div>
  );
};

export default BorrowRepayPage;