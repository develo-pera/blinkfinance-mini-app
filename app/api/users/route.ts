/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { withAuth } from "@/lib/middleware";

// GET /api/users - Get all users (protected)
export const GET = withAuth(async (_request: NextRequest, _context: any, _user: any) => {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
});

// POST /api/users - Create a new user (public - for registration)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { fid, username, displayName, pfpUrl, bio, email, walletAddress } = body;

    // Validate required fields
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: "walletAddress is required" },
        { status: 400 }
      );
    }

    // Check if user already exists by wallet address
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User address already exists" },
        { status: 400 }
      );
    }

    const user = new User({
      fid,
      username,
      displayName,
      pfpUrl,
      bio,
      email,
      walletAddress
    });

    await user.save();

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
