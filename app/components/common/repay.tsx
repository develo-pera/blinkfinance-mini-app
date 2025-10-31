import { Button } from "@/components/ui/button"
import { ActivePage } from "@/app/page";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";


const RepayPage = ({
  outstandingBorrowed,
  setActivePage,
  refetchBalance,
  refetchFinancialData,
  isFetchingFinancialData,
}: {
  outstandingBorrowed: number,
  isFetchingFinancialData: boolean,
  setActivePage: (page: ActivePage) => void,
  refetchBalance: () => void,
  refetchFinancialData: () => void,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amountToRepayInputRef = useRef<HTMLInputElement>(null);

  const handleRepay = async () => {
    setIsSubmitting(true);
    const amountToRepay = amountToRepayInputRef.current?.value;
    if (!amountToRepay) {
      toast.error("Please enter an amount to repay");
      return;
    }

    if (Number(amountToRepay) > outstandingBorrowed) {
      toast.error("You can't repay more than you owe");
      return;
    }

    try {
      const response = await fetch("/api/valut-contract/repay", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("bf-token")}`,
        },
        body: JSON.stringify({ amount: Number(amountToRepay) }),
      });

      const result = await response.json();
      console.log("result", result);
    } catch (error) {
      console.error("Error repaying money:", error);
      toast.error(error instanceof Error ? error.message : "Failed to repay money");
    } finally {
      refetchBalance();
      refetchFinancialData();
      setIsSubmitting(false);
    }
    toast.success(`Repaid ${amountToRepay} successfully`);
    setActivePage("home");
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

  if (outstandingBorrowed <= 0) {
    return (
      <div className="my-5" >
        <p className="text-gray-500 mb-5" > You have no debts to repay. Go to the borrow page if you want to borrow more funds.</p>
        < Button onClick={() => setActivePage("borrow")} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground" > Borrow </Button>
      </div>
    );
  }

  return (
    <div className="my-5">
      <Input ref={amountToRepayInputRef} className="text-4xl font-bold py-10" type="number" placeholder="$" />
      <p className="text-gray-500 mt-2 mb-5 text-sm">You owe ${outstandingBorrowed.toLocaleString()}.</p>
      <Button
        onClick={handleRepay}
        disabled={isSubmitting}
        className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">
        {isSubmitting ? "Processing..." : "Repay"}
      </Button>
    </div>
  );
}

export default RepayPage;