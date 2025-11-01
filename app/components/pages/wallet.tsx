import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { isAddress, Chain } from "viem";
import { truncateAddress } from "@/lib/utils";
import { mainnet, base } from "viem/chains";
import { getAddress, useAvatar, useName } from "@coinbase/onchainkit/identity";
import Image from "next/image";
import { useDebounce } from "@/app/hooks/useDebounce";
import CONSTANTS from "@/lib/consts";
import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

const transferAbi = [
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  }
];

const WalletPage = ({
  balance,
  isFetchingBalance,
  refetchBalance,
}: {
  balance: number,
  isFetchingBalance: boolean,
  refetchBalance: () => void,
}) => {
  const [transferAmount, setTransferAmount] = useState<number | undefined>(undefined);
  const [transferTo, setTransferTo] = useState<string>("");
  const debouncedTransferTo = useDebounce<string>(transferTo);
  const [resolvedTransferTo, setResolvedTransferTo] = useState("");
  const [isResolvingTransferTo, setIsResolvingTransferTo] = useState(false);

  const { data: ensName, isLoading: isEnsNameLoading, isError: isEnsNameError } = useName({ address: resolvedTransferTo as `0x${string}`, chain: mainnet as Chain });
  const { data: baseEnsName, isLoading: isBaseEnsNameLoading, isError: isBaseEnsNameError } = useName({ address: resolvedTransferTo as `0x${string}`, chain: base as Chain });
  const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useAvatar({ ensName: ensName as string, chain: mainnet as Chain });
  const { data: baseEnsAvatar, isLoading: isBaseEnsAvatarLoading } = useAvatar({ ensName: baseEnsName as string, chain: base as Chain });

  // TODO: check this
  const transferAddress = isAddress(resolvedTransferTo) ? resolvedTransferTo as `0x${string}` : transferTo as `0x${string}`;

  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: CONSTANTS.token.mockBFStabelcoinVault,
    abi: transferAbi,
    functionName: "transfer",
    args: transferAddress && transferAmount && transferAmount > 0
      ? [transferAddress, BigInt(Number(transferAmount) * 1000000)]
      : undefined,
    query: {
      enabled: !!transferAddress && transferAmount !== undefined && transferAmount > 0 && isAddress(transferAddress),
    },
  });

  const { writeContract, data: hash, isPending: isWriting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    confirmations: 3,
  });

  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      setTransferAmount(undefined);
      setTransferTo("");
      toast.success("Transfer successful");
    }
  }, [isSuccess]);

  const handleTransfer = async () => {
    if (transferAmount && transferAmount > balance) {
      toast.error("You can't transfer more than your balance");
      return;
    }

    if (!isAddress(resolvedTransferTo) && !isAddress(transferTo)) {
      toast.error("Invalid recipient");
      return;
    }

    if (!simulateData) {
      if (simulateError) {
        toast.error(simulateError.message || "Simulation failed");
      }
      return;
    }

    try {
      writeContract(simulateData.request);
    } catch (error) {
      console.error("Error transferring funds:", error);
      toast.error("Transfer failed");
    }
  }

  // TODO: check this end

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
        <Input value={transferAmount || ""} onChange={(e) => setTransferAmount(Number(e.target.value))} className="text-4xl font-bold py-10" type="number" placeholder="$0" />
        <Input value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="py-10 mt-2" type="text" placeholder="Enter recipient wallet address or domain name" />
        {
          isFetchingBalance ? (
            <>
              <Skeleton className="w-[50%] h-[20px] rounded-md mt-2" />
              <Skeleton className="w-[70%] h-[20px] rounded-md mt-2" />
            </>
          ) : (
            <>
              <p className=" mt-2 text-sm text-gray-500">Your balance: ${balance?.toLocaleString()}</p>
              <p className=" mt-2 text-sm text-gray-500">Account balance after transfer: ${(balance - (transferAmount || 0))?.toLocaleString()}</p>
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
      <Button
        disabled={transferAmount && transferAmount <= 0 || !transferTo || isWriting || isConfirming || !simulateData}
        onClick={handleTransfer}
        className="mt-2 w-full rounded-xl bg-[var(--bf-card-background)] text-foreground"
      >
        {isWriting ? "Confirming..." : isConfirming ? "Processing..." : "Transfer"}
      </Button>
    </div>
  );
};

export default WalletPage;