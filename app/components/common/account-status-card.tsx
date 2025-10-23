const AccountStatusCard = ({ name, financialData }: { name: string, financialData: { totalAmount: number, totalRepaid: number, totalBorrowed: number } }) => {
  const { totalAmount, totalRepaid, totalBorrowed } = financialData;

  // Calculate percentages for the segmented bar
  const balance = totalAmount - totalRepaid - totalBorrowed;
  const outstandingBorrowed = totalBorrowed - totalRepaid; // 4000 - 2500 = 1500
  const repaidPercentage = (totalRepaid / totalAmount) * 100; // 25%
  const outstandingBorrowedPercentage = (outstandingBorrowed / totalAmount) * 100; // 15%
  const availablePercentage = (balance / totalAmount) * 100; // 35%

  return (
    <div className="bg-[var(--bf-card-background)] p-4 rounded-xl">
      <p className="mb-7 text-xl">Hello {name}</p>
      <p className="text-sm text-gray-500">Account Balance</p>
      <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
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
            <span>Repaid: ${financialData.totalRepaid.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Outstanding: ${outstandingBorrowed.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Available: ${balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Total Amount</p>
            <p className="font-semibold">${financialData.totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Repaid</p>
            <p className="font-semibold text-blue-600">${financialData.totalRepaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Outstanding</p>
            <p className="font-semibold text-green-600">${outstandingBorrowed.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Available</p>
            <p className="font-semibold text-purple-600">${balance.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusCard;