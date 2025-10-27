import { Address } from "viem";
import { baseSepolia } from "wagmi/chains";
import { useBalance } from "wagmi";
import CONSTANTS from "@/lib/consts";

const useFetchMockStabelcoinBalance = (address: Address | undefined) => {
  const { data, refetch, isFetching } = useBalance({
    address: address,
    chainId: baseSepolia.id,
    token: CONSTANTS.token.mockBFStabelcoinVault,
    query: {
      enabled: !!address,
    },
  });

  return { data, refetch, isFetching };
};

export default useFetchMockStabelcoinBalance;