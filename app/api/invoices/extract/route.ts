/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withAuth } from "@/lib/middleware";

// Interface for extracted invoice data
interface ExtractedInvoiceData {
  invoiceNumber: string;
  eInvoiceNumber?: string;
  issuedDate: string;
  dueDate: string;
  totalAmount: number;
}

// TODO: implement this once openai billing page starts working again

// POST /api/invoices/extract - Extract invoice data from PDF
export const POST = withAuth(async (request: NextRequest, _context: any, _user: any) => {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const eid: ExtractedInvoiceData = {
    invoiceNumber: "1234567890",
    eInvoiceNumber: "1234567890",
    issuedDate: "2024-01-01",
    dueDate: "2024-01-01",
    totalAmount: 1000,
  }

  console.log("EID", eid);

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  });

  try {
    // Check if OpenAI API key is configured
    if (!openaiApiKey) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    console.log("FILE", file)

    const response = await openai.responses.create({
      model: "gpt-5",
      input: "Hello, how are you?",
    });

    console.log("RESPONSE", response);

    return NextResponse.json({
      success: true,
      data: response,
    });

    // if (!file) {
    //   return NextResponse.json(
    //     { success: false, error: "No file uploaded" },
    //     { status: 400 }
    //   );
    // }

    // // Validate file type
    // if (file.type !== "application/pdf") {
    //   return NextResponse.json(
    //     { success: false, error: "Only PDF files are allowed" },
    //     { status: 400 }
    //   );
    // }

    // // Validate file size (max 20MB for OpenAI)
    // const maxSize = 20 * 1024 * 1024; // 20MB
    // if (file.size > maxSize) {
    //   return NextResponse.json(
    //     { success: false, error: "File size too large. Maximum 20MB allowed." },
    //     { status: 400 }
    //   );
    // }

    // // For now, return mock data while we work on the PDF processing
    // // TODO: Implement actual PDF processing with OpenAI
    // const mockData: ExtractedInvoiceData = {
    //   invoiceNumber: "INV-2024-001",
    //   eInvoiceNumber: "EINV-2024-001",
    //   issuedDate: "15.01.2024",
    //   dueDate: "15.02.2024",
    //   totalAmount: 1500.00
    // };

    // console.log("Processing PDF:", file.name, "Size:", file.size, "bytes");

    // return NextResponse.json({
    //   success: true,
    //   data: mockData,
    //   message: "PDF processing with OpenAI coming soon. Currently returning mock data."
    // });

  } catch (error) {
    console.error("Error processing invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process invoice" },
      { status: 500 }
    );
  }
});