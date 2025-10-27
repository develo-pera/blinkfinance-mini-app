import { formatAmount } from "@/lib/utils";
import { ExtractedInvoiceData } from "../pages/upload";
import { formatInvoiceDate } from "./invoice-list";

const Invoice = ({ invoice }: { invoice: ExtractedInvoiceData | null }) => {
  return (
    <div className="w-full max-w-[250px] min-h-[350px] m-auto bg-[#f4f4f4] border-1 border-gray-500 dark:border-white rounded-xs p-2">
      <div className="mb-3">
        <p className="text-xs text-gray-500">Invoice Number:</p>
        <p className="text-xs text-gray-500 break-all">{invoice?.invoiceId}</p>
        <p className="text-xs text-gray-500">E-Invoice Number:</p>
        <p className="text-xs text-gray-500 break-all">{invoice?.eInvoiceId}</p>
      </div>
      <p className="text-xs text-gray-500">Invoice Date: {invoice?.issuedDate && formatInvoiceDate(invoice?.issuedDate)}</p>
      <p className="text-xs text-gray-500">Due Date: {invoice?.dueDate && formatInvoiceDate(invoice?.dueDate)}</p>
      {/* TODO: handle status properly */}
      <p className="text-xs text-gray-500">Status: {invoice?.valid ? "Valid" : ""}</p>
      <div className="my-5 grid gap-[3px]">
        <p className="text-xs text-gray-500 border-b border-black mb-2">Items</p>
        <div className="w-full h-[5px] bg-gray-200" />
        <div className="w-full h-[5px] bg-gray-200" />
        <div className="w-full h-[5px] bg-gray-200" />
      </div>
      <p className="text-sm text-gray-500 font-semibold text-right">Total Amount:</p>
      <p className="text-sm text-black/70 font-semibold text-right">{formatAmount(invoice?.totalAmount || 0)} USD</p>
    </div>
  )
}

export default Invoice;