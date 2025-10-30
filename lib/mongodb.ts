import mongoose from "mongoose";
import { User } from "@/models/User";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blinkfi-mini-app";

const connectDB = async () => {
  if (!MONGODB_URI) {
    throw new Error(
      "Add the MONGODB_URI environment variable inside .env.local to use mongoose"
    );
  }
  return mongoose
    .connect(MONGODB_URI)
    .catch((e) => console.error("Mongoose Client Error: " + e.message));
};

export default connectDB;

// Ensures the correct partial unique index on `fid` exists.
// If a legacy `fid_1` unique index without a partial filter exists, we drop it safely
// and let Mongoose re-create the proper index from the model definition.
export const ensureUserIndexes = async () => {
  await connectDB();
  try {
    // Best-effort: drop legacy index if it exists with wrong options
    await User.collection.dropIndex("fid_1");
  } catch (_err) {
    // ignore if index does not exist
  }
  try {
    await User.syncIndexes();
  } catch (err) {
    console.error("Failed to sync User indexes:", (err as Error).message);
  }
};