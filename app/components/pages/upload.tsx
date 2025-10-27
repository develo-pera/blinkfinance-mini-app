"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Invoice from "../common/invoice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ActivePage } from "@/app/page";
import SignInButton from "../common/sign-in-button";
import { FinancialData } from "@/app/page";

// Interface for extracted invoice data
export interface ExtractedInvoiceData {
  invoiceId: string;
  eInvoiceId?: string;
  issuedDate: Date;
  dueDate: Date;
  valid: boolean;
  totalAmount: number;
}

// const mockExtractInvoiceData = {
//   id: 1,
//   invoiceNumber: "2403251",
//   eInvoiceNumber: "d1b2650e-1e64-4cb2-9e5b-a49e23f54802",
//   valid: true,
//   status: "Approved",
//   invoiceDate: new Date(),
//   dueDate: new Date(),
//   amount: 14653.00
// } as ExtractedInvoiceData;

const UploadPage = ({
  refetchInvoices,
  setActivePage,
  setLoadingState,
  isAuthenticated,
  refetchUser,
  profileCompleted,
  refetchFinancialData,
}: {
  refetchInvoices: () => void,
  setActivePage: (page: ActivePage) => void,
  setLoadingState: (loadingState: boolean) => void,
  isAuthenticated: boolean, refetchUser: () => void,
  profileCompleted: boolean,
  refetchFinancialData: () => void,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];

    if (uploadedFile?.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (uploadedFile) {
      setIsProcessing(true);
      setFile(uploadedFile);
      setLoadingState(true);

      const formData = new FormData();
      formData.append("file", uploadedFile);
      const response = await fetch("/api/invoices/extract", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("bf-token")}`,
        },
        body: formData,
      });

      const result = await response.json();

      const dueDate = result.data.dueDate || new Date(result.data.issuedDate).setDate(new Date(result.data.issuedDate).getDate() + 30);
      // TODO: this is a temporary fix to convert the dates to date objects
      const extractedData = {
        ...result.data,
        eInvoiceId: result.data.eInvoiceId || result.data.invoiceId,
        issuedDate: new Date(result.data.issuedDate),
        dueDate: new Date(dueDate),
      } as ExtractedInvoiceData;

      setExtractedData(extractedData);
      setIsProcessing(false);
      setLoadingState(false);
    }
  };

  const handleFinanceInvoice = async () => {
    setIsSubmitting(true);
    setLoadingState(true);
    if (!extractedData) {
      toast.error("Please upload an invoice first");
      return;
    }

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("bf-token")}`,
        },
        body: JSON.stringify(extractedData),
      });
      const result = await response.json();
      if (result.success) {
        // TODO: refetch invoices
        // TODO: refetch financial data
        setExtractedData(null);
        setFile(null);
        refetchInvoices();
        refetchFinancialData();
        toast.success("Invoice submitted for financing");
        setActivePage("home");
      } else {
        toast.error(result.error || "Failed to create invoice");
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit invoice");
    } finally {
      setIsSubmitting(false);
      setLoadingState(false);
    }
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
            <p className="bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)] rounded-t-xl p-4">{file?.name}</p>
          ) : (
            <p className="bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)] rounded-t-xl p-4">No file selected</p>
          )
        }
      </div>
      <div className="">
        {/* Show extracted data if available, otherwise show mock invoice */}
        {/* bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)] */}
        <div className="p-6 rounded-b-xl bg-[var(--bf-card-background)]">
          <Invoice invoice={extractedData || null} />
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