"use client";

import { ActivePage, FinancialData } from "@/app/page";
import { Button } from "@/components/ui/button";
import BorrowPage from "../common/borrow";

const RepayPage = ({ outstandingBorrowed, setActivePage, refetchFinancialData }: { outstandingBorrowed: number, setActivePage: (page: ActivePage) => void, refetchFinancialData: () => void }) => {
  if (outstandingBorrowed <= 0) {
    return (
      <div className="my-5">
        <p className="text-gray-500 mb-5">You have no debts to repay. Go to the borrow page if you want to borrow more funds.</p>
        <Button onClick={() => setActivePage("borrow")} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Borrow</Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Repay Page</h1>
      {/* Lint error temp fix */}
      <div onClick={refetchFinancialData} />
    </div>
  );
}

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
            refetchFinancialData={refetchFinancialData}
          />
        )
      }
      <Button onClick={() => setActivePage("home")} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Go back</Button>
    </div>
  );
};

export default BorrowRepayPage;