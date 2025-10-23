import mongoose, { Document, Schema } from "mongoose";
import toJSON from "./plugins/toJSON";

// User Schema
export interface IUser extends Document {
  fid: string;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  email?: string;
  walletAddress?: string;
  company?: mongoose.Types.ObjectId; // Reference to single company owned by user
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  fid: {
    type: String,
  },
  username: {
    type: String,
    sparse: true
  },
  displayName: {
    type: String
  },
  pfpUrl: {
    type: String
  },
  bio: {
    type: String
  },
  email: {
    type: String,
    sparse: true,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    index: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

UserSchema.plugin(toJSON);

UserSchema.index(
  { fid: 1 },
  { unique: true, partialFilterExpression: { fid: { $exists: true, $ne: null } } }
);

// Export User model
export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
