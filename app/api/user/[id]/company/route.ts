/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Company } from "@/models/Company";
import { User } from "@/models/User";
import { withAuth } from "@/lib/middleware";

// GET /api/user/[id]/company - Get user's company (protected)
export const GET = withAuth(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  user: any
) => {
  try {
    await connectDB();
    const { id } = await params;

    // Check if user is trying to access their own company
    if (user._id.toString() !== id) {
      return NextResponse.json(
        { success: false, error: "Access denied. You can only access your own company." },
        { status: 403 }
      );
    }

    // First check if user exists
    const userData = await User.findById(id);
    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's company
    const company = await Company.findOne({ ownerId: id })
      .populate("owner", "fid username displayName email");

    if (!company) {
      return NextResponse.json(
        { success: false, error: "User has no company" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    console.error("Error fetching user company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch company" },
      { status: 500 }
    );
  }
});

// POST /api/user/[id]/company - Create user's company (protected)
export const POST = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  user: any
) => {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Check if user is trying to create their own company
    if (user._id.toString() !== id) {
      return NextResponse.json(
        { success: false, error: "Access denied. You can only create your own company." },
        { status: 403 }
      );
    }

    const { name, logo, address, taxId, registrationNumber } = body;

    // Validate required fields
    if (!name || !address || !taxId || !registrationNumber) {
      return NextResponse.json(
        { success: false, error: "name, address, taxId, and registrationNumber are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userData = await User.findById(id);
    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user already has a company
    const existingCompany = await Company.findOne({ ownerId: id });
    if (existingCompany) {
      return NextResponse.json(
        { success: false, error: "User already has a company" },
        { status: 409 }
      );
    }

    // Create company
    const company = await Company.create({
      name,
      logo,
      address,
      taxId,
      registrationNumber,
      ownerId: id,
    });

    // Update user to reference the company
    await User.findByIdAndUpdate(id, { company: company._id });

    // Populate owner data
    await company.populate("owner", "fid username displayName email");

    return NextResponse.json({ success: true, data: company }, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { success: false, error: "User already has a company" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create company" },
      { status: 500 }
    );
  }
});

// PUT /api/user/[id]/company - Update user's company (protected)
export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  user: any
) => {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Check if user is trying to update their own company
    if (user._id.toString() !== id) {
      return NextResponse.json(
        { success: false, error: "Access denied. You can only update your own company." },
        { status: 403 }
      );
    }

    const { name, logo, address, taxId, registrationNumber } = body;

    if (!name || !address || !taxId || !registrationNumber) {
      return NextResponse.json(
        { success: false, error: "name, address, taxId, and registrationNumber are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userData = await User.findById(id);
    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update company (only owner can update)
    const company = await Company.findOneAndUpdate(
      { ownerId: id },
      { name, logo, address, taxId, registrationNumber },
      { new: true, runValidators: true, upsert: true }
    ).populate("owner", "fid username displayName email");

    console.log("company", company);

    if (!company) {
      return NextResponse.json(
        { success: false, error: "User has no company to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update company" },
      { status: 500 }
    );
  }
});

// DELETE /api/user/[id]/company - Delete user's company (protected)
export const DELETE = withAuth(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  user: any
) => {
  try {
    await connectDB();
    const { id } = await params;

    // Check if user is trying to delete their own company
    if (user._id.toString() !== id) {
      return NextResponse.json(
        { success: false, error: "Access denied. You can only delete your own company." },
        { status: 403 }
      );
    }

    // Check if user exists
    const userData = await User.findById(id);
    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Delete company (only owner can delete)
    const company = await Company.findOneAndDelete({ ownerId: id });

    if (!company) {
      return NextResponse.json(
        { success: false, error: "User has no company to delete" },
        { status: 404 }
      );
    }

    // Remove company reference from user
    await User.findByIdAndUpdate(id, { $unset: { company: 1 } });

    return NextResponse.json({
      success: true,
      message: "Company deleted successfully",
      data: company
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete company" },
      { status: 500 }
    );
  }
});
