/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { withAuth } from "@/lib/middleware";

// GET /api/users/[id] - Get user by id (protected - users can only access their own data)
export const GET = withAuth(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  user: any
) => {
  try {
    await connectDB();
    const { id } = await params;

    // Check if user is trying to access their own data
    const resourceUserId = id;
    if (user._id.toString() !== resourceUserId) {
      return NextResponse.json(
        { success: false, error: "Access denied. You can only access your own data." },
        { status: 403 }
      );
    }

    const userData = await User.findById(id);

    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
});

// PUT /api/users/[id] - Update user (protected - users can only update their own data)
export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  user: any
) => {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Check if user is trying to update their own data
    const resourceUserId = id;
    if (user._id.toString() !== resourceUserId) {
      return NextResponse.json(
        { success: false, error: "Access denied. You can only update your own data." },
        { status: 403 }
      );
    }

    const userData = await User.findOneAndUpdate(
      { _id: id },
      body,
      { new: true, runValidators: true }
    );

    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
});

// DELETE /api/users/[id] - Delete user (protected - users can only delete their own data)
export const DELETE = withAuth(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  user: any
) => {
  try {
    await connectDB();
    const { id } = await params;

    // Check if user is trying to delete their own data
    const resourceUserId = id;
    if (user._id.toString() !== resourceUserId) {
      return NextResponse.json(
        { success: false, error: "Access denied. You can only delete your own data." },
        { status: 403 }
      );
    }

    const userData = await User.findOneAndDelete({ _id: id });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
});
