import { capitalizeFirstLetter, formatAmount } from "@/lib/utils";
import { formatInvoiceDate } from "./invoice-list";
import { InvoiceType } from "@/models/Invoice";

// export type InvoiceType = {
//   id: number;
//   invoiceNumber: string;
//   eInvoiceNumber: string;
//   amount: number;
//   date: Date;
//   valid: boolean;
//   status: string;
//   invoiceDate: Date;
//   dueDate: Date;
// }

const applyStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-gray-500";
    case "approved":
      return "text-green-500";
    case "aejected":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

const InvoiceCard = ({ invoice }: { invoice: InvoiceType }) => {
  return (
    <div className="flex gap-2 items-center bg-[var(--bf-card-background)] p-4 rounded-xl">
      {/* <div className="w-[30px] h-[30px] f rounded-md overflow-hidden bg-gray-200">
        <FileText className="w-6 h-6" />
        <p>{invoice.status.charAt(0)}</p>
      </div> */}
      <div>
        <p>Invoice No. {invoice.invoiceId} for {formatAmount(invoice.totalAmount)}</p>
        <p className="text-sm text-gray-500"><span className={applyStatusColor(invoice.status)}>{capitalizeFirstLetter(invoice.status)}</span> · Issued {formatInvoiceDate(new Date(invoice.issuedDate))} · Due {formatInvoiceDate(new Date(invoice.dueDate))}</p>
      </div>

    </div>
  )
}

export default InvoiceCard;