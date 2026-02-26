import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/hash.js";
import { ApiError } from "../utils/ApiError.js";

/* ---------------- CREATE USER ---------------- */
export const createUserService = async (data) => {
  const { email, password, role, name, phone } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    name,
    phone,
  });

  return user;
};

/* ---------------- GET ALL USERS ---------------- */
export const getAllUsersService = async () => {
  return await User.find().select("-password -refreshToken");
};

/* ---------------- GET SINGLE USER ---------------- */
export const getUserByIdService = async (id) => {
  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

/* ---------------- UPDATE USER ---------------- */
export const updateUserService = async (id, updates) => {
  const allowedUpdates = ["role", "status", "name", "phone"];

  const filteredUpdates = {};

  allowedUpdates.forEach((key) => {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  });

  const user = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
  }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

/* ---------------- DELETE USER ---------------- */
export const deleteUserService = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return true;
};
