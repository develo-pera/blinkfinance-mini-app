import mongoose, { Document, Schema } from "mongoose";

// Company Schema
export interface ICompany extends Document {
  name: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  taxId: string;
  registrationNumber: string;
  ownerId: mongoose.Types.ObjectId; // Reference to User who created the company
}

const CompanySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  logo: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, maxlength: 200, required: true },
    city: { type: String, maxlength: 100, required: true },
    state: { type: String, maxlength: 100, required: true },
    country: { type: String, maxlength: 100, required: true },
    zipCode: { type: String, maxlength: 20, required: true },
  },
  taxId: {
    type: String,
    maxlength: 50,
    unique: true,
    required: true,
  },
  registrationNumber: {
    type: String,
    maxlength: 50,
    unique: true,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
CompanySchema.index({ ownerId: 1 });
CompanySchema.index({ name: 1 });

// Virtual for owner population
CompanySchema.virtual("owner", {
  ref: "User",
  localField: "ownerId",
  foreignField: "_id",
  justOne: true
});

CompanySchema.set("toJSON", { virtuals: true });
CompanySchema.set("toObject", { virtuals: true });

// Export Company model
export const Company = mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
