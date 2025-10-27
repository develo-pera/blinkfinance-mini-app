import { useQuery } from "@tanstack/react-query";
import { FinancialData } from "../page";

const initialFinancialData: FinancialData = {
  totalApprovedAmount: 0,
  totalRepaidAmount: 0,
  totalBorrowedAmount: 0,
}

const useFetchFinancialData = (userAddress: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["financialData"],
    queryFn: async () => {
      const response = await fetch(`/api/valut-contract/${userAddress}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        console.error("Error fetching financial data", data.error);
        throw new Error(data.error);
      }
    },
    enabled: !!userAddress,
    initialData: initialFinancialData,
  });

  return { data: data as FinancialData, isLoading, error, refetch };
};

export default useFetchFinancialData;