import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { Company } from "@/models/Company";

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

    try {
      const user = await User.findOne({ walletAddress });
      console.log(user);
      return user;
    } catch (e) {
      console.log(e);
    }

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

// Company operations
export const companyService = {
  async createCompany(companyData: {
    name: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    taxId?: string;
    registrationNumber?: string;
    ownerId: string;
  }) {
    await connectDB();

    const company = new Company(companyData);
    await company.save();

    // Add company to user's companies array
    await User.findByIdAndUpdate(
      companyData.ownerId,
      { $addToSet: { companies: company._id } }
    );

    return await company.populate("owner", "fid username displayName email");
  },

  async getCompanyById(companyId: string) {
    await connectDB();
    return await Company.findById(companyId)
      .populate("owner", "fid username displayName email")
  },

  async getCompaniesByOwnerId(ownerId: string) {
    await connectDB();
    return await Company.find({ ownerId, isActive: true })
      .populate("owner", "fid username displayName email")
      .sort({ createdAt: -1 });
  },

  async updateCompany(companyId: string, ownerId: string, updateData: Partial<{
    name: string;
    address: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    taxId: string;
    registrationNumber: string;
  }>) {
    await connectDB();

    // Only allow owner to update
    const company = await Company.findOneAndUpdate(
      { _id: companyId, ownerId },
      updateData,
      { new: true, runValidators: true }
    ).populate("owner", "fid username displayName email");

    if (!company) {
      throw new Error("Company not found or you do not have permission to update it");
    }

    return company;
  },

  async deleteCompany(companyId: string, ownerId: string) {
    await connectDB();

    // Only allow owner to delete (soft delete)
    const company = await Company.findOneAndUpdate(
      { _id: companyId, ownerId },
      { new: true }
    );

    if (!company) {
      throw new Error("Company not found or you do not have permission to delete it");
    }

    // Remove company from user's companies array
    await User.findByIdAndUpdate(
      ownerId,
      { $pull: { companies: companyId } }
    );

    return company;
  },

  async getAllCompanies() {
    await connectDB();
    return await Company.find({ isActive: true })
      .populate("owner", "fid username displayName email")
      .sort({ createdAt: -1 });
  },

  async searchCompanies(query: string) {
    await connectDB();
    return await Company.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { taxId: { $regex: query, $options: "i" } },
        { registrationNumber: { $regex: query, $options: "i" } }
      ]
    })
      .populate("owner", "fid username displayName email")
      .sort({ createdAt: -1 });
  }
};
