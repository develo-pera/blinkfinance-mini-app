import { useQuery } from "@tanstack/react-query";

const useFetchCompany = (ownerId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["blinkfinance-company", ownerId],
    queryFn: async () => {
      const response = await fetch(`/api/user/${ownerId}/company`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bf-token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch company");
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!ownerId,
  });

  return { data, isLoading, error, refetch };
};

export default useFetchCompany;