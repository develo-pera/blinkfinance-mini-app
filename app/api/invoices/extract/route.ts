/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withAuth } from "@/lib/middleware";
import { ResponseInputContent } from "openai/resources/responses/responses.mjs";

// TODO: Check if invoice is valid PEPPOL invoice and if it's legit here

// POST /api/invoices/extract - Extract invoice data from PDF
export const POST = withAuth(async (request: NextRequest, _context: any, _user: any) => {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const openai = new OpenAI({
    apiKey: openaiApiKey,
  });

  if (!openaiApiKey) {
    return NextResponse.json(
      { success: false, error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file uploaded" },
      { status: 400 }
    );
  }

  // Validate file type
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { success: false, error: "Only PDF files are allowed" },
      { status: 400 }
    );
  }

  // Validate file size (max 20MB for OpenAI)
  const maxSize = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { success: false, error: "File size too large. Maximum 20MB allowed." },
      { status: 400 }
    );
  }

  try {
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: "assistants",
    });

    const response = await openai.responses.create({
      model: "gpt-5",
      text: {
        format: { type: "json_object" }
      },
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              file_id: uploadedFile.id,
            },
            {
              type: "input_text",
              text: `
Extract the following fields from the attached invoice and return ONLY a JSON object (no prose):
{
  "invoiceId": "string",
  "eInvoiceId": "string",
  "issuedDate": "Date",
  "dueDate": "Date",
  "totalAmount": "number"
}

Rules:
- Dates must be retuned as date object.
- totalAmount is numeric (no currency symbol, no thousands separators; use dot as decimal).
- If a field is missing, set it to "" (empty string) or 0 for totalAmount.
- invoiceId doesn't have to be the same as the eInvoiceId.  
              `
            },
          ] as ResponseInputContent[]
        },
      ],
    });

    console.log("RESPONSE", response);

    if (response.error) {
      throw new Error("There was an error extracting the invoice data");
    }

    const data = JSON.parse(response.output_text as string);

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        valid: true,
      },
    });
  } catch (error) {
    console.error("Error processing invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process invoice" },
      { status: 500 }
    );
  }
});