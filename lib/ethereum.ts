import { createTestClient, createWalletClient, http, publicActions, walletActions } from "viem";
import type { WalletClient, Chain, Transport, PublicActions, TestClient, WalletActions } from "viem";
import { base, baseSepolia, foundry } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { config as appConfig } from "@/app.config";

const account = privateKeyToAccount(process.env.BACKEND_PRVATE_KEY as `0x${string}`);

export const getEthereumWallet = (config?: { localTestnet?: boolean, chain?: Chain, rpcUrl?: string }): WalletClient & PublicActions | TestClient & PublicActions & WalletActions => {

  if (config?.localTestnet || appConfig?.useLocalTestnet) {
    console.log("FOUNDRY ANVIL");
    return createTestClient({
      chain: foundry,
      mode: "anvil",
      transport: http(),
      account,
    })
      .extend(publicActions)
      .extend(walletActions) as TestClient & PublicActions & WalletActions;
  }

  const chain = config?.chain || baseSepolia;

  console.log(`NETWORK: ${chain?.name}`);
  return createWalletClient({
    chain,
    transport: http(config?.rpcUrl || chain?.rpcUrls.default.http[0]) as Transport,
    account,
  }).extend(publicActions) as WalletClient & PublicActions;
};