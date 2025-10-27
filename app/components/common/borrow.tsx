"use client";

import { useRef, useState } from "react";
import { ActivePage } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const BorrowPage = ({
  availableToBorrow,
  isFetchingFinancialData,
  setActivePage,
  refetchBalance,
  refetchFinancialData,
}: {
  availableToBorrow: number,
  isFetchingFinancialData: boolean,
  setActivePage: (page: ActivePage) => void,
  refetchBalance: () => void,
  refetchFinancialData: () => void,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amountToBorrowInputRef = useRef<HTMLInputElement>(null);

  const handleGetCash = async () => {
    setIsSubmitting(true);
    const amountToBorrow = amountToBorrowInputRef.current?.value;

    if (!amountToBorrow) {
      toast.error("Please enter an amount to borrow");
      return;
    }
    if (Number(amountToBorrow) > availableToBorrow) {
      toast.error("You can't borrow more than you have available");
      return;
    }

    try {
      const response = await fetch("/api/valut-contract/borrow", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("bf-token")}`,
        },
        body: JSON.stringify({ amount: Number(amountToBorrow) }),
      });

      const result = await response.json();
      console.log("result", result);
      if (result.success) {
        // refetchBalance();
        // refetchFinancialData();
        toast.success("Cash received");
        setActivePage("home");
      } else {
        throw new Error(result.error || "Failed to borrow money");
      }
    } catch (error) {
      console.error("Error borrowing money:", error);
      toast.error(error instanceof Error ? error.message : "Failed to borrow money");
    } finally {
      refetchBalance();
      refetchFinancialData();
      setIsSubmitting(false);
    }
  }

  if (isFetchingFinancialData) {
    return (
      <div className="my-5">
        <Skeleton className="w-full h-[82px] rounded-md py-10" />
        <Skeleton className="w-[50%] h-[20px] rounded-md mt-2 mb-5" />
        <Button
          disabled={true}
          className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">
          Loading...
        </Button>
      </div>
    );
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
      <p className="text-gray-500 mt-2 mb-5 text-sm">You can borrow up to ${availableToBorrow.toLocaleString()}.</p>
      <Button
        onClick={handleGetCash}
        disabled={isSubmitting}
        className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">
        {isSubmitting ? "Processing..." : "Get cash"}
      </Button>
    </div>
  );
};

export default BorrowPage;