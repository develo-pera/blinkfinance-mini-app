import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import connectDB from "@/lib/mongodb";
import { Invoice } from "@/models/Invoice";
import { Company } from "@/models/Company";

export const GET = withAuth(async (_request: NextRequest, _context: any, user: any) => {
  try {
    await connectDB();
    console.log("user", user);
    const userCompany = await Company.findOne({ ownerId: user._id });
    if (!userCompany) {
      return NextResponse.json({ success: false, error: "User has no company" }, { status: 404 });
    }

    const invoices = await Invoice.find({ companyId: userCompany.id }, null, { sort: { createdAt: -1 } });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: NextRequest, _context: any, user: any) => {
  try {
    await connectDB();
    const userCompany = await Company.findOne({ ownerId: user._id });
    if (!userCompany) {
      return NextResponse.json({ success: false, error: "User has no company" }, { status: 404 });
    }

    const body = await request.json();
    const { invoiceId, eInvoiceId, issuedDate, dueDate, totalAmount, valid } = body;

    if (!invoiceId || !eInvoiceId || !issuedDate || !dueDate || !totalAmount || !valid) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const invoice = await Invoice.create({
      invoiceId,
      eInvoiceId,
      issuedDate,
      dueDate,
      totalAmount,
      status: "approved", // TODO: do checks if invoice is financable
      valid,
      companyId: userCompany.id,
    });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
});