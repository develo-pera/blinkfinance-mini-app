"use client";

import { useRef } from "react";
import { ActivePage, FinancialData } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import CONSTANTS from "@/lib/consts";
import { useWriteContract, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { http } from "viem";
import { useEffect } from "react";

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(baseSepolia.rpcUrls.default.http[0]),
  },
});

const BorrowPage = ({ availableToBorrow, setActivePage, refetchMockStabelcoinBalance }: { availableToBorrow: number, setActivePage: (page: ActivePage) => void, refetchMockStabelcoinBalance: () => void }) => {
  const amountToBorrowInputRef = useRef<HTMLInputElement>(null);
  const { writeContract, isSuccess } = useWriteContract({
    config,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Cash received");
      refetchMockStabelcoinBalance();
    }
  }, [isSuccess]);

  const handleGetCash = () => {
    const amountToBorrow = amountToBorrowInputRef.current?.value;

    if (!amountToBorrow) {
      toast.error("Please enter an amount to borrow");
      return;
    }
    if (Number(amountToBorrow) > availableToBorrow) {
      toast.error("You can't borrow more than you have available");
      return;
    }

    const result = writeContract({
      address: CONSTANTS.token.mockBFStabelcoinVault,
      abi: [
        {
          name: "selfMint",
          type: "function",
          inputs: [
            { name: "amount", type: "uint256" },
          ]
        }
      ],
      functionName: "selfMint",
      args: [Number(amountToBorrow) * 1000000],
    });

    console.log("tx", result);
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

const BorrowRepayPage = ({ activePage, setActivePage, financialData, refetchMockStabelcoinBalance }: { activePage: ActivePage, setActivePage: (page: ActivePage) => void, financialData: FinancialData, refetchMockStabelcoinBalance: () => void }) => {
  return (
    <div className="p-4 flex flex-col flex-1">
      <h1>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
      {activePage === "borrow" && <BorrowPage availableToBorrow={financialData.totalAvailableAmount - financialData.totalBorrowed} setActivePage={setActivePage} refetchMockStabelcoinBalance={refetchMockStabelcoinBalance} />}
      {activePage === "repay" && <RepayPage outstandingBorrowed={financialData.totalBorrowed - financialData.totalRepaid} setActivePage={setActivePage} />}
      <Button onClick={() => setActivePage("home")} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Go back</Button>
    </div>
  );
};

export default BorrowRepayPage;