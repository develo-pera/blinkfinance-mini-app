import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { isAddress } from "viem";
import { Chain } from "viem";
import { truncateAddress } from "@/lib/utils";
import { mainnet, base } from "viem/chains";
import { getAddress, useAddress, useAvatar, useName } from "@coinbase/onchainkit/identity";
import Image from "next/image";
import { useDebounce } from "@/app/hooks/useDebounce";

const WalletPage = ({
  balance,
  isFetchingBalance,
  refetchBalance,
}: {
  balance: number,
  isFetchingBalance: boolean,
  refetchBalance: () => void,
}) => {
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferTo, setTransferTo] = useState<string>("");
  const debouncedTransferTo = useDebounce<string>(transferTo);
  const [resolvedTransferTo, setResolvedTransferTo] = useState("");
  const [isResolvingTransferTo, setIsResolvingTransferTo] = useState(false);

  const { data: ensName, isLoading: isEnsNameLoading, isError: isEnsNameError } = useName({ address: resolvedTransferTo as `0x${string}`, chain: mainnet as Chain });
  const { data: baseEnsName, isLoading: isBaseEnsNameLoading, isError: isBaseEnsNameError } = useName({ address: resolvedTransferTo as `0x${string}`, chain: base as Chain });
  const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useAvatar({ ensName: ensName as string, chain: mainnet as Chain });
  const { data: baseEnsAvatar, isLoading: isBaseEnsAvatarLoading } = useAvatar({ ensName: baseEnsName as string, chain: base as Chain });
  const { } = useAddress({ name: transferTo, chain: mainnet as Chain });
  const { } = useAddress({ name: transferTo, chain: base as Chain })

  console.log(refetchBalance);

  const handleTransfer = async () => {
    if (transferAmount > balance) {
      toast.error("You can't transfer more than your balance");
      return;
    }

    if (!isAddress(resolvedTransferTo) || !isAddress(transferTo)) {
      toast.error("Invalid recipient");
      return;
    }

    try {

    } catch (error) {
      console.error("Error transferring funds:", error);
      toast.error("Transfer failed");
    }
  }

  useEffect(() => {
    const resolveTransferTo = async () => {
      setIsResolvingTransferTo(true);
      if (isAddress(debouncedTransferTo)) {
        setResolvedTransferTo(debouncedTransferTo);
        setIsResolvingTransferTo(false);
        return;
      } else {
        setResolvedTransferTo("");
        const addressFromENS = await getAddress({ name: debouncedTransferTo, chain: mainnet as Chain });
        const addressFromBaseENS = await getAddress({ name: debouncedTransferTo, chain: base as Chain });
        if (addressFromENS) {
          setResolvedTransferTo(addressFromENS as string);
          setIsResolvingTransferTo(false);
          return;
        } else if (addressFromBaseENS) {
          setResolvedTransferTo(addressFromBaseENS as string);
          setIsResolvingTransferTo(false);
          return;
        }
      }
      setIsResolvingTransferTo(false);
    };
    resolveTransferTo();
  }, [debouncedTransferTo]);

  const formatSendingTo = () => {
    if (ensName && !isEnsNameError && isAddress(transferTo)) {
      return ensName;
    }

    if (baseEnsName && !isBaseEnsNameError && isAddress(transferTo)) {
      return baseEnsName;
    }

    if (isAddress(resolvedTransferTo)) {
      return truncateAddress(resolvedTransferTo as `0x${string}`);
    } else {
      return "";
    }
  }

  return (
    <div className="px-4 flex flex-col flex-1">
      <div className="mt-5 p-4 bg-[var(--bf-card-background)] rounded-xl">
        <Input onChange={(e) => setTransferAmount(Number(e.target.value))} className="text-4xl font-bold py-10" type="number" placeholder="$0" />
        <Input onChange={(e) => setTransferTo(e.target.value)} className="py-10 mt-2" type="text" placeholder="Enter recipient wallet address or domain name" />
        {
          isFetchingBalance ? (
            <>
              <Skeleton className="w-[50%] h-[20px] rounded-md mt-2" />
              <Skeleton className="w-[70%] h-[20px] rounded-md mt-2" />
            </>
          ) : (
            <>
              <p className=" mt-2 text-sm text-gray-500">Your balance: ${balance?.toLocaleString()}</p>
              <p className=" mt-2 text-sm text-gray-500">Account balance after transfer: ${(balance - transferAmount)?.toLocaleString()}</p>
            </>
          )
        }
        {
          isEnsNameLoading || isBaseEnsNameLoading || isEnsAvatarLoading || isBaseEnsAvatarLoading || isResolvingTransferTo ? (
            <div className="flex items-center justify-between gap-2 mt-1">
              <Skeleton className="w-[50%] h-[20px] rounded-md" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="text-sm text-gray-500">Sending to: {formatSendingTo()}</p>
              <div className="rounded-xl bg-gray-100 h-6 w-6">
                {(ensAvatar || baseEnsAvatar) && <Image src={(ensAvatar || baseEnsAvatar) as string} alt="avatar" className="rounded-full" width={24} height={24} />}
              </div>
            </div>
          )
        }
      </div>
      <Button disabled={transferAmount <= 0 || !transferTo} onClick={handleTransfer} className="mt-2 w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Transfer</Button>
    </div>
  );
};

export default WalletPage;