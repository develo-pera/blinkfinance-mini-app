import mongoose, { Document, Schema } from "mongoose";
import toJSON from "./plugins/toJSON";

export type InvoiceStatus = "pending" | "approved" | "rejected";

// TODO: add recipient information
export interface IInvoice {
  invoiceId: string;
  eInvoiceId: string;
  issuedDate: Date;
  dueDate: Date;
  totalAmount: number;
  status: InvoiceStatus;
  valid: boolean;
  companyId: mongoose.Types.ObjectId; // Reference to Company
}

export interface IInvoiceDocument extends IInvoice, Document { }

export type InvoiceType = {
  id: mongoose.Types.ObjectId;
  invoiceId: string;
  eInvoiceId: string;
  issuedDate: Date;
  dueDate: Date;
  totalAmount: number;
  status: InvoiceStatus;
  valid: boolean;
  companyId: mongoose.Types.ObjectId;
}

const InvoiceSchema = new Schema<IInvoiceDocument>({
  invoiceId: { type: String, required: true },
  eInvoiceId: { type: String, required: true },
  issuedDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true },
  valid: { type: Boolean, required: true },
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

// Indexes for better performance
InvoiceSchema.index({ companyId: 1 });
InvoiceSchema.index({ invoiceId: 1 });
InvoiceSchema.index({ eInvoiceId: 1 });
InvoiceSchema.index({ issuedDate: 1 });
InvoiceSchema.index({ dueDate: 1 });

InvoiceSchema.virtual("company", {
  ref: "Company",
  localField: "companyId",
  foreignField: "_id",
  justOne: true
});

InvoiceSchema.plugin(toJSON);

export const Invoice = mongoose.models.Invoice || mongoose.model<IInvoiceDocument>("Invoice", InvoiceSchema);