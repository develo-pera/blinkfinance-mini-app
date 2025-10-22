import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

const useFetchUser = (address: Address | undefined) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["blinkfinance-user", address],
    queryFn: async () => {
      const response = await fetch("/api/users/wallet/" + address);
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!address, // Only run query when address exists
  });

  return { data, isLoading, error, refetch };
};

export default useFetchUser;