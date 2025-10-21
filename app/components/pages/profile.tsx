"use client";

import { Button } from "@/components/ui/button";
import { Context } from "@farcaster/miniapp-sdk";
import Image from "next/image";
import { Building2, LogOut, Pencil } from "lucide-react";
import { useDisconnect } from "wagmi";
import { Address } from "viem";
import { useName } from "@coinbase/onchainkit/identity";
import { base, mainnet } from "wagmi/chains";
import { Chain } from "viem";
import { truncateAddress } from "@/lib/utils";

const ProfilePage = ({ user, address }: { user?: Context.UserContext, address?: Address }) => {
  const { disconnect } = useDisconnect();
  const { data: ensName, isLoading: isEnsNameLoading } = useName({ address: address as `0x${string}`, chain: mainnet as Chain });
  const { data: baseEnsName, isLoading: isBaseEnsNameLoading } = useName({ address: address as `0x${string}`, chain: base as Chain });

  const displayDomain = ensName || baseEnsName;

  // TODO: if data is loading, show skeleton loader.

  console.log("isEnsNameLoading", isEnsNameLoading);
  console.log("isBaseEnsNameLoading", isBaseEnsNameLoading);

  return (
    <div className="px-4 flex flex-col flex-1">
      <div className="mt-10 px-4">
        {/* TODO */}
        <h1 className="text-2xl font-bold">{user?.displayName || "Developera"}</h1>
        <p>{displayDomain || truncateAddress(address as Address)}</p>

        <p className="text-sm text-gray-500">petar@ethbelgrade.rs</p>
      </div>

      <div className="my-10 p-4 bg-[var(--bf-card-background)] rounded-2xl">
        <h2 className="text-3xl">Your Company</h2>
        <div className="mt-5 bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)] rounded-xl p-4">
          <div className="flex items-start justify-between gap-5">
            <p className="font-bold">Blockops doo</p>
            <Image src="https://joobpool-production.s3.amazonaws.com/ETH%20Belgrade/eth-bdg.jpg" alt="company logo" width={50} height={50} className="rounded-sm" />
          </div>
          <div className="mt-15 text-sm">
            <p>VAT: <span className="opacity-60">1234567890</span></p>
            <p>Reg. No: <span className="opacity-60">1234567890</span></p>
            <p>Address: <span className="opacity-60">123 Main St, Anytown, USA</span></p>
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-5">
        <Button onClick={() => console.log("Edit profile")} className=" w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">
          <Pencil className="w-4h-4" /> Edit profile
        </Button>

        <Button onClick={() => console.log("Edit company")} className="w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">
          <Building2 className="w-4h-4" /> Edit Company
        </Button>
      </div>


      <Button onClick={() => disconnect()} className="mt-5 w-full rounded-xl">
        <LogOut className="w-4h-4" /> Log out
      </Button>
    </div>
  );
};

export default ProfilePage;