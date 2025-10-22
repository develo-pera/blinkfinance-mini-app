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
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  fid: {
    type: String,
    unique: true,
    index: true
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

UserSchema.plugin(toJSON);

// Export User model
export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
