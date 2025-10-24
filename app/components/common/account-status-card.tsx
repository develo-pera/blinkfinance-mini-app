"use client";

import { FinancialData } from "@/app/page";
import { useBalance } from "wagmi";
import { Address } from "viem";
import { baseSepolia } from "wagmi/chains";
import { formatUnits } from "viem";

const AccountStatusCard = ({ name, financialData, address }: { name: string, financialData: FinancialData, address: Address | undefined }) => {
  const { totalInvoiceAmount, totalAvailableAmount, totalRepaid, totalBorrowed } = financialData;
  const { data } = useBalance({
    address: address,
    chainId: baseSepolia.id,
  });

  const balance = (Number(formatUnits(data?.value || BigInt(0), 18))).toFixed(2);

  console.log("balance data", data);

  // Calculate percentages for the segmented bar
  // TODO: this should be account balance for stablecoin that we use
  const availableBalance = totalAvailableAmount - totalBorrowed;
  const outstandingBorrowed = totalBorrowed - totalRepaid;

  // Fixed percentage calculations
  const repaidPercentage = (totalRepaid / totalInvoiceAmount) * 100; // ~17%
  const outstandingBorrowedPercentage = (outstandingBorrowed / totalInvoiceAmount) * 100; // 50% of bar
  const availablePercentage = ((totalAvailableAmount - totalBorrowed) / totalInvoiceAmount) * 100; // Up to 97.5%

  return (
    <div className="bg-[var(--bf-card-background)] p-4 rounded-xl">
      <p className="mb-7 text-xl">Hello {name}</p>
      <p className="text-sm text-gray-500">Account Balance</p>
      <p className="text-3xl font-bold">${balance?.toLocaleString()}</p>
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
            <span>Repaid: ${totalRepaid.toLocaleString()}</span>
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
            <p className="font-semibold">${totalInvoiceAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Repaid</p>
            <p className="font-semibold text-blue-600">${totalRepaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Outstanding</p>
            <p className="font-semibold text-green-600">${outstandingBorrowed.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Available To Borrow</p>
            <p className="font-semibold text-purple-600">${totalAvailableAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusCard;