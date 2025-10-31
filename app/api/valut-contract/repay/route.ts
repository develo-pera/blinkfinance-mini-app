import { withAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getEthereumWallet } from "@/lib/ethereum";
import CONSTANTS from "@/lib/consts";

export const POST = withAuth(async (request: NextRequest, _context: any, user: any) => {
  const { amount } = await request.json();

  if (!amount) {
    return NextResponse.json({ success: false, error: "Amount is required" }, { status: 400 });
  }

  if (!user?.walletAddress) {
    return NextResponse.json({ success: false, error: "User has no wallet address" }, { status: 400 });
  }

  try {
    const wallet = getEthereumWallet();
    const { request: txRequest } = await wallet?.simulateContract({
      account: wallet?.account,
      address: CONSTANTS.token.mockBFStabelcoinVault as `0x${string}`,
      abi: [
        {
          name: "repay",
          type: "function",
          inputs: [
            { name: "user", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          outputs: [],
        },
      ],
      functionName: "repay",
      args: [user.walletAddress as `0x${string}`, BigInt(amount * 1000000)],
    });

    const txHash = await wallet?.writeContract(txRequest);

    if (!txHash) {
      throw new Error("Failed to repay money");
    }

    await wallet?.waitForTransactionReceipt({ hash: txHash, confirmations: 3 });

    console.log("txHash", txHash);

    return NextResponse.json({ success: true, data: { txHash } });
  } catch (error) {
    console.error("Error repaying money:", error);
    return NextResponse.json({ success: false, error: "Failed to repay money" }, { status: 500 });
  }
});