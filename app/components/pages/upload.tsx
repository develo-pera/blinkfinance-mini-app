"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Invoice from "../common/invoice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InvoiceType } from "../common/invoice-card";
import { ActivePage } from "@/app/page";
import SignInButton from "../common/sign-in-button";
import { FinancialData } from "@/app/page";

// Interface for extracted invoice data
interface ExtractedInvoiceData {
  id: number;
  invoiceNumber: string;
  eInvoiceNumber?: string;
  date: Date;
  valid: boolean;
  status: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
}

const mockExtractInvoiceData = {
  id: 1,
  invoiceNumber: "2403251",
  eInvoiceNumber: "d1b2650e-1e64-4cb2-9e5b-a49e23f54802",
  date: new Date(),
  valid: true,
  status: "Approved",
  invoiceDate: new Date(),
  dueDate: new Date(),
  amount: 14653.00
} as ExtractedInvoiceData;

const UploadPage = ({ appendInvoice, appendFinancialData, setActivePage, setLoadingState, isAuthenticated, refetchUser, profileCompleted }: { appendInvoice: (invoice: InvoiceType) => void, appendFinancialData: (financialData: FinancialData) => void, setActivePage: (page: ActivePage) => void, setLoadingState: (loadingState: boolean) => void, isAuthenticated: boolean, refetchUser: () => void, profileCompleted: boolean }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];

    if (uploadedFile?.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (uploadedFile) {
      setIsProcessing(true);
      setFile(uploadedFile);
      setLoadingState(true);

      setTimeout(() => {
        setExtractedData(mockExtractInvoiceData);
        setIsProcessing(false);
        setLoadingState(false);
      }, 3000);
    }
  };


  const handleFinanceInvoice = async () => {
    setIsSubmitting(true);
    setLoadingState(true);
    if (!extractedData) {
      toast.error("Please upload an invoice first");
      return;
    }

    console.log("extractedData", extractedData);

    setTimeout(() => {
      appendInvoice(extractedData as InvoiceType);
      appendFinancialData({
        totalInvoiceAmount: extractedData.amount,
        totalAvailableAmount: extractedData.amount / 100 * 90,
        totalRepaid: 0,
        totalBorrowed: 0,
      });
      setIsSubmitting(false);
      setLoadingState(false);
      toast.success("Invoice approved for financing!");
      setActivePage("home");
    }, 5000);
    // setIsProcessing(true);
    // setExtractedData(null);

    // try {

    //   // Get auth token from localStorage (assuming it's stored there after login)
    //   const token = localStorage.getItem("bf-token");

    //   if (!token) {
    //     toast.error("Please log in to upload invoices");
    //     return;
    //   }


    //   const formData = new FormData();
    //   formData.append("file", file);
    //   // const arrayBuffer = await file.arrayBuffer();
    //   // const parser = new PDFParse({ data: arrayBuffer });
    //   // const pdfText = await parser.getText();

    //   // Call the extraction API
    //   const response = await fetch("/api/invoices/extract", {
    //     method: "POST",
    //     headers: {
    //       "Authorization": `Bearer ${token}`,
    //       // "Content-Type": "multipart/form-data",
    //     },
    //     body: formData,
    //   });

    //   const result = await response.json();

    //   if (!response.ok) {
    //     throw new Error(result.error || "Failed to process invoice");
    //   }

    //   if (result.success) {
    //     setExtractedData(result.data);
    //     toast.success("Invoice data extracted successfully!");

    //     // Log the extracted data for debugging
    //     console.log("Extracted invoice data:", result.data);
    //   } else {
    //     throw new Error(result.error || "Failed to extract invoice data");
    //   }

    // } catch (error) {
    //   console.error("Error processing invoice:", error);
    //   toast.error(error instanceof Error ? error.message : "Failed to process invoice");
    // } finally {
    //   setIsProcessing(false);
    // }
  };

  const handleCancel = () => {
    fileInputRef.current!.value = "";
    setFile(null);
    setExtractedData(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 flex flex-col flex-1">
        <p className="opacity-80">Please sign in to upload invoices</p>
        <SignInButton className="mt-auto" refetchUser={refetchUser} />
      </div>
    );
  }

  if (!profileCompleted) {
    return (
      <div className="p-4 flex flex-col flex-1">
        <p className="opacity-80">Please complete your profile to upload invoices</p>
        <Button onClick={() => setActivePage("complete-profile")} className="mt-auto rounded-xl bg-[var(--bf-card-background)] text-foreground">Complete profile</Button>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col flex-1">
      <div className="">
        <h1 className="mb-2">Upload invoice</h1>
        {
          file ? (
            <p className="bg-[var(--bf-card-background)] rounded-xl p-4">{file?.name}</p>
          ) : (
            <p className="bg-[var(--bf-card-background)] rounded-xl p-4">No file selected</p>
          )
        }
      </div>
      <div className="mt-5">
        {/* Show extracted data if available, otherwise show mock invoice */}
        <div className="p-6 rounded-xl">
          <Invoice invoice={extractedData as InvoiceType | null} />
        </div>

        {/* File input */}
        <input
          hidden
          id="file-input"
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Button
            onClick={handleUpload}
            className="w-full rounded-xl"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload PDF"
            )}
          </Button>
          <Button
            onClick={handleFinanceInvoice}
            disabled={!extractedData || isSubmitting}
            className="w-full rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Invoice"
            )}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={!file && !extractedData}
            className="col-span-2 rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;