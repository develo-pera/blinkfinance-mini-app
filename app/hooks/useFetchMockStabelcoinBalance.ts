import { Address } from "viem";
import { baseSepolia } from "wagmi/chains";
import { useBalance } from "wagmi";
import CONSTANTS from "@/lib/consts";

const useFetchMockStabelcoinBalance = (address: Address | undefined) => {
  const { data, refetch } = useBalance({
    address: address,
    chainId: baseSepolia.id,
    token: CONSTANTS.token.mockBFStabelcoinVault,
    query: {
      enabled: !!address,
    },
  });

  console.log("mock stablecoin balance", data);

  return { data, refetch };
};

export default useFetchMockStabelcoinBalance;