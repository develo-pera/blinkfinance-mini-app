import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

// GET /api/users/wallet/[address] - Get user by wallet address
export async function GET(
  _request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    await connectDB();
    const user = await User.findOne({ walletAddress: params.address });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user by wallet address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
