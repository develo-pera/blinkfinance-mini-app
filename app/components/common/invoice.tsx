import { formatAmount } from "@/lib/utils";
import { InvoiceType } from "./invoice-card";
import { formatInvoiceDate } from "./invoice-list";

const Invoice = ({ invoice }: { invoice: InvoiceType | null }) => {
  return (
    <div className="w-full max-w-[250px] min-h-[350px] m-auto bg-[#f4f4f4] border-2 border-gray-200 rounded-xs p-2">
      <div className="mb-3">
        <p className="text-xs text-gray-500">Invoice Number:</p>
        <p className="text-xs text-gray-500">{invoice?.invoiceNumber}</p>
        <p className="text-xs text-gray-500">E-Invoice Number:</p>
        <p className="text-xs text-gray-500">{invoice?.eInvoiceNumber}</p>
      </div>
      <p className="text-xs text-gray-500">Invoice Date: {invoice?.invoiceDate && formatInvoiceDate(invoice?.invoiceDate)}</p>
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
      <p className="text-sm text-black/70 font-semibold text-right">{formatAmount(invoice?.amount || 0)} USD</p>
    </div>
  )
}

export default Invoice;