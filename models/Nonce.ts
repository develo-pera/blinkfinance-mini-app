import mongoose, { Document, Schema } from "mongoose";
import toJSON from "./plugins/toJSON";

export interface INonce extends Document {
  nonce: string;
  // expiresAt: Date;
}

const NonceSchema = new Schema<INonce>({
  nonce: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // expiresAt: {
  //   type: Date,
  //   default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
  //   expires: 0, // MongoDB TTL index - deletes documents when expiresAt is reached
  // },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

NonceSchema.plugin(toJSON);

export const Nonce = mongoose.models.Nonce || mongoose.model<INonce>("Nonce", NonceSchema);