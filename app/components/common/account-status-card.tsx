import { FinancialData } from "@/app/page";
import { RefreshCcwIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const AccountStatusCard = ({
  name,
  financialData,
  balance,
  totalInvoiceAmount,
  refetchBalance,
  isFetchingBalance,
  isFetchingInvoices,
  isFetchingFinancialData,
}: {
  name: string,
  financialData: FinancialData,
  balance: number,
  totalInvoiceAmount: number,
  refetchBalance: () => void,
  isFetchingBalance: boolean,
  isFetchingInvoices: boolean,
  isFetchingFinancialData: boolean,
}) => {
  const { totalApprovedAmount, totalRepaidAmount, totalBorrowedAmount } = financialData;

  // Calculate percentages for the segmented bar
  // TODO: this should be account balance for stablecoin that we use
  const availableBalance = totalApprovedAmount - totalBorrowedAmount;
  const outstandingBorrowed = totalBorrowedAmount - totalRepaidAmount;

  // Fixed percentage calculations
  const repaidPercentage = (totalRepaidAmount / totalInvoiceAmount) * 100; // ~17%
  const outstandingBorrowedPercentage = (outstandingBorrowed / totalInvoiceAmount) * 100; // 50% of bar
  const availablePercentage = ((totalApprovedAmount - totalBorrowedAmount) / totalInvoiceAmount) * 100; // Up to 97.5%

  return (
    <div className="bg-[var(--bf-card-background)] p-4 rounded-xl">
      <p className="mb-7 text-xl">Hello {name}</p>
      <p className="text-sm text-gray-500">Account Balance</p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-3xl font-bold">${balance?.toLocaleString()}</p>
        <p onClick={() => {
          console.log("refetching balance");
          refetchBalance()
        }} className="text-sm text-gray-500 cursor-pointer flex items-center gap-2"> <RefreshCcwIcon className={cn("w-3 h-3", isFetchingBalance ? "animate-spin" : "")} /> {isFetchingBalance ? "Refreshing" : "Refresh"} balance</p>
      </div>
      <div className="mt-7">
        {/* Segmented Bar Chart */}
        <div className="w-full h-2 bg-[#242424] dark:bg-gray-200 rounded-full overflow-hidden flex">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${repaidPercentage}%` }}
          ></div>
          <div
            className="bg-green-500 h-full"
            style={{ width: `${outstandingBorrowedPercentage}%` }}
          ></div>
          <div
            className="bg-purple-500 h-full"
            style={{ width: `${availablePercentage}%` }}
          ></div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Repaid: ${totalRepaidAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Outstanding: ${outstandingBorrowed.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Available: ${availableBalance.toLocaleString()}</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Total Invoice Amount</p>
            {isFetchingInvoices ? <Skeleton className="w-20 h-3 rounded-md mt-[8px]" /> : <p className="font-semibold">${totalInvoiceAmount.toLocaleString()}</p>}
          </div>
          <div>
            <p className="text-gray-500">Total Repaid</p>
            {isFetchingFinancialData ? <Skeleton className="w-20 h-3 rounded-md mt-[8px]" /> : <p className="font-semibold text-blue-600">${totalRepaidAmount.toLocaleString()}</p>}
          </div>
          <div>
            <p className="text-gray-500">Outstanding</p>
            {isFetchingFinancialData ? <Skeleton className="w-20 h-3 rounded-md mt-[8px]" /> : <p className="font-semibold text-green-600">${outstandingBorrowed.toLocaleString()}</p>}
          </div>
          <div>
            <p className="text-gray-500">Available To Borrow</p>
            {isFetchingFinancialData ? <Skeleton className="w-20 h-3 rounded-md mt-[8px]" /> : <p className="font-semibold text-purple-600">${availableBalance.toLocaleString()}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusCard;