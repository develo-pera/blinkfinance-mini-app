import { NextResponse, NextRequest } from "next/server";
import { getEthereumWallet } from "@/lib/ethereum";
import CONSTANTS from "@/lib/consts";
import { FinancialData } from "@/app/page";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ userAddress: string }> }
) => {
  const { userAddress } = await params;

  if (!userAddress) {
    return NextResponse.json({ success: false, error: "Missing wallet address" }, { status: 400 });
  }

  const wallet = getEthereumWallet();

  const contract = {
    address: CONSTANTS.token.mockBFStabelcoinVault as `0x${string}`,
    abi: [
      {
        name: "approvedAmounts",
        type: "function",
        inputs: [
          { name: "user", type: "address" },
        ],
        outputs: [
          { name: "approvedAmount", type: "uint256" },
        ],
      },
      {
        name: "borrowedAmounts",
        type: "function",
        inputs: [
          { name: "user", type: "address" },
        ],
        outputs: [
          { name: "borrowedAmount", type: "uint256" },
        ],
      },
      {
        name: "repaidAmounts",
        type: "function",
        inputs: [
          { name: "user", type: "address" },
        ],
        outputs: [
          { name: "repaidAmount", type: "uint256" },
        ],
      },
    ],
  }

  const results = await wallet?.multicall({
    contracts: [{
      ...contract,
      functionName: "approvedAmounts",
      args: [userAddress as `0x${string}`],
    }, {
      ...contract,
      functionName: "borrowedAmounts",
      args: [userAddress as `0x${string}`],
    }, {
      ...contract,
      functionName: "repaidAmounts",
      args: [userAddress as `0x${string}`],
    }],
  })

  let callFailed = false;
  results?.forEach((result) => {
    if (result.status === "failure") {
      console.log("result", result);
      callFailed = true;
      return;
    }
  })

  if (callFailed) {
    return NextResponse.json({ success: false, error: "Call to contract failed" }, { status: 500 });
  }

  const data: FinancialData = {
    totalApprovedAmount: Number(results?.[0]?.result) / 10 ** 6,
    totalBorrowedAmount: Number(results?.[1]?.result) / 10 ** 6,
    totalRepaidAmount: Number(results?.[2]?.result) / 10 ** 6,
  }

  return NextResponse.json({ success: true, data });
}