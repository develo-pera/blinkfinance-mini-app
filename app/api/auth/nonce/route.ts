import { Nonce } from "@/models/Nonce";
import { NextResponse } from "next/server";
import { generateSiweNonce } from "viem/siwe";
import connectDB from "@/lib/mongodb";

export const GET = async () => {
  await connectDB();
  const nonce = generateSiweNonce();

  try {
    await Nonce.create({ nonce });

    return NextResponse.json({ success: true, data: nonce });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to generate nonce" }, { status: 500 });
  }
}