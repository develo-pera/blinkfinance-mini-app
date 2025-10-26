import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ActivePage } from "@/app/page";
import InvoiceCard from "./invoice-card";
import { InvoiceType } from "@/models/Invoice";

// Helper function to format date as DD.MM.YYYY
export const formatInvoiceDate = (date: Date): string => {
  // const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const InvoiceList = ({ invoices, isFetchingInvoices, setActivePage, isAuthenticated }: { invoices: InvoiceType[], isFetchingInvoices: boolean, setActivePage: (page: ActivePage) => void, isAuthenticated: boolean }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between px-4">
        <p className="">Uploaded Invoices</p>
        <Button disabled={!isAuthenticated} onClick={() => setActivePage("upload")} className="rounded-xl bg-[var(--bf-card-background)] text-foreground">
          <Plus className="w-2.5 h-2.5" />
          Add Invoice
        </Button>
      </div>
      <div className="mt-5 grid gap-4">
        {isFetchingInvoices ? (
          <div className="mt-5 px-4">
            <p className="opacity-80">Loading invoices...</p>
          </div>
        ) : (
          invoices?.length > 0 ? invoices?.map((invoice) => (
            <InvoiceCard key={invoice.invoiceId} invoice={invoice} />
          )) : (
            <div className="mt-5 px-4">
              <p className="opacity-80">No invoices found</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default InvoiceList;