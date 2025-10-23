import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company } from '@/models/Company';

// GET /api/companies/[id] - Get company by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const company = await Company.findById(id);

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}

// PUT /api/companies/[id] - Update company (owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const { ownerId, ...updateData } = body;

    if (!ownerId || !updateData.name || !updateData.address || !updateData.taxId || !updateData.registrationNumber) {
      return NextResponse.json(
        { success: false, error: "ownerId, name, address, taxId, and registrationNumber are required" },
        { status: 400 }
      );
    }

    const company = await Company.findOneAndUpdate(
      { _id: id, ownerId },
      updateData,
      { new: true, runValidators: true }
    ).populate("owner", "fid username displayName email");

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found or you do not have permission to update it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    console.error("Error updating company:", error);

    if (error instanceof Error && error.message.includes("permission")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update company" },
      { status: 500 }
    );
  }
}

// DELETE /api/companies/[id] - Delete company (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json(
        { success: false, error: "ownerId is required" },
        { status: 400 }
      );
    }

    const company = await Company.findOneAndDelete(
      { _id: id, ownerId },
    ).populate("owner", "fid username displayName email");

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found or you do not have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Company deleted successfully",
      data: company
    });
  } catch (error) {
    console.error("Error deleting company:", error);

    if (error instanceof Error && error.message.includes("permission")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to delete company" },
      { status: 500 }
    );
  }
}
