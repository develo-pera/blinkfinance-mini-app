import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

// User operations
export const userService = {
  async createOrUpdateUser(userData: {
    id?: string;
    fid?: string;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    bio?: string;
    email?: string;
    walletAddress: string;
  }) {
    await connectDB();

    const user = await User.findOneAndUpdate(
      { $or: [{ id: userData.id }, { fid: userData.fid }, { walletAddress: userData.walletAddress }] },
      userData,
      { upsert: true, new: true, runValidators: true }
    );

    return user;
  },

  async getUserById(id: string) {
    await connectDB();
    return await User.findOne({ id });
  },

  async getUserByFid(fid: string) {
    await connectDB();
    return await User.findOne({ fid });
  },

  async getUserByWalletAddress(walletAddress: string) {
    await connectDB();
    return await User.findOne({ walletAddress });
  },

  async getUserByEmail(email: string) {
    await connectDB();
    return await User.findOne({ email });
  },

  async getAllUsers() {
    await connectDB();
    return await User.find();
  },

  async updateUser(id: string, updateData: Partial<{
    username: string;
    displayName: string;
    pfpUrl: string;
    bio: string;
    email: string;
    walletAddress: string;
  }>) {
    await connectDB();

    return await User.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );
  },

  // TODO: This should be soft delete, not actual delete
  async deleteUser(id: string) {
    await connectDB();

    return await User.findOneAndDelete({ id });
  }
};
