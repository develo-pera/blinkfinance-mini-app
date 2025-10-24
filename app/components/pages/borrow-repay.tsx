"use client";

import { useRef } from "react";
import { ActivePage, FinancialData } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const BorrowPage = ({ availableToBorrow, setActivePage }: { availableToBorrow: number, setActivePage: (page: ActivePage) => void }) => {
  const amountToBorrowInputRef = useRef<HTMLInputElement>(null);

  const handleGetCash = () => {
    const amountToBorrow = amountToBorrowInputRef.current?.value
    if (!amountToBorrow) {
      toast.error("Please enter an amount to borrow");
      return;
    }
    if (Number(amountToBorrow) > availableToBorrow) {
      toast.error("You can't borrow more than you have available");
      return;
    }
    // TODO: call the smart contract to get cash
  }

  if (availableToBorrow <= 0) {
    return (
      <div className="my-5">
        <p className="text-gray-500 mb-5">You have no funds available to borrow. Please upload an invoice to get started.</p>
        <Button onClick={() => setActivePage("upload")} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Upload Invoice</Button>
      </div>
    );
  }

  return (
    <div className="my-5">
      <Input ref={amountToBorrowInputRef} className="text-4xl font-bold py-10" type="number" placeholder="$" />
      <p className="text-gray-500 mt-2 mb-5 text-sm">You can borrow up to ${availableToBorrow}.</p>
      <Button onClick={handleGetCash} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Get cash</Button>
    </div>
  );
}

const RepayPage = ({ outstandingBorrowed, setActivePage }: { outstandingBorrowed: number, setActivePage: (page: ActivePage) => void }) => {
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
    </div>
  );
}

const BorrowRepayPage = ({ activePage, setActivePage, financialData }: { activePage: ActivePage, setActivePage: (page: ActivePage) => void, financialData: FinancialData }) => {
  return (
    <div className="p-4 flex flex-col flex-1">
      <h1>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
      {activePage === "borrow" && <BorrowPage availableToBorrow={financialData.totalAvailableAmount - financialData.totalBorrowed} setActivePage={setActivePage} />}
      {activePage === "repay" && <RepayPage outstandingBorrowed={financialData.totalBorrowed - financialData.totalRepaid} setActivePage={setActivePage} />}
      <Button onClick={() => setActivePage("home")} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Go back</Button>
    </div>
  );
};

export default BorrowRepayPage;