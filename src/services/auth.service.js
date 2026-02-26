import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { comparePassword } from "../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

/* ---------------- LOGIN SERVICE ---------------- */
export const loginService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new ApiError(401, "Invalid credentials");

  if (user.status !== "active") {
    throw new ApiError(403, "Account is not active");
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};

/* ---------------- REFRESH SERVICE ---------------- */
export const refreshService = async (refreshToken) => {
  if (!refreshToken) throw new ApiError("401", "Unauthorized");

  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken)
    throw new ApiError("403", "Forbidden");

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    newAccessToken,
    newRefreshToken,
  };
};

/* ---------------- LOGOUT SERVICE ---------------- */
export const logoutService = async (refreshToken) => {
  if (!refreshToken) return;

  await User.updateOne({ refreshToken }, { $set: { refreshToken: null } });
};
