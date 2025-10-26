import { createTestClient, createWalletClient, http, publicActions, walletActions } from "viem";
import type { WalletClient, Chain, Transport, PublicActions, TestClient, WalletActions } from "viem";
import { base, foundry } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.BACKEND_PRVATE_KEY as `0x${string}`);

// export const getEthereumWallet = (chain?: Chain): Client<Transport, Chain, Account> => {
//   return createWalletClient({
//     chain: chain || base,
//     transport: http(chain?.rpcUrls.default.http[0]) as Transport,
//     account,
//   }).extend(publicActions) as Client<Transport, Chain, Account, undefined, PublicActions<Transport, Chain, Account>>;
// };


export const getEthereumWallet = ({ localTestnet, chain, rpcUrl }: { localTestnet?: boolean, chain?: Chain, rpcUrl?: string }): WalletClient & PublicActions | TestClient & PublicActions & WalletActions => {
  if (localTestnet) {
    return createTestClient({
      chain: foundry,
      mode: "anvil",
      transport: http(),
      account,
    })
      .extend(publicActions)
      .extend(walletActions) as TestClient & PublicActions & WalletActions;
  }

  return createWalletClient({
    chain: chain || base,
    transport: http(rpcUrl || chain?.rpcUrls.default.http[0]) as Transport,
    account,
  }).extend(publicActions) as WalletClient & PublicActions;
};