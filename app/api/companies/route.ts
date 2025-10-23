import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Company } from "@/models/Company";

// GET /api/companies - Get all companies or search companies
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const ownerId = searchParams.get("ownerId");

    let companies;

    if (ownerId) {
      // Get companies by owner
      companies = await Company.find({ ownerId });
    } else if (query) {
      // Search companies
      companies = await Company.find({ $or: [{ name: { $regex: query, $options: "i" } }, { taxId: { $regex: query, $options: "i" } }, { registrationNumber: { $regex: query, $options: "i" } }] });
    } else {
      // Get all companies
      companies = await Company.find();
    }

    return NextResponse.json({ success: true, data: companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create a new company
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      name,
      address,
      taxId,
      registrationNumber,
      ownerId
    } = body;

    // Validate required fields
    if (!name || !ownerId || !address || !taxId || !registrationNumber) {
      return NextResponse.json(
        { success: false, error: "Name, ownerId, address, taxId, and registrationNumber are required" },
        { status: 400 }
      );
    }

    const company = await Company.create({
      name,
      address,
      taxId,
      registrationNumber,
      ownerId,
    });

    return NextResponse.json({ success: true, data: company }, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create company" },
      { status: 500 }
    );
  }
}