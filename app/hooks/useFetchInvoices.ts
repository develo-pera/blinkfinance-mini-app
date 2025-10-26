import { InvoiceType } from "@/models/Invoice";
import { useQuery } from "@tanstack/react-query";

const useFetchInvoices = (userId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["blinkfinance-invoices"],
    queryFn: async () => {
      const response = await fetch("/api/invoices", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bf-token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!userId,
  });

  return { data: data as InvoiceType[], isLoading, error, refetch };
};

export default useFetchInvoices;