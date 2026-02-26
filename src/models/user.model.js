import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: [
        "admin",
        "director",
        "engineer",
        "installation-incharge",
        "marketing-coordinator",
        "marketing-executive",
        "quality-control",
        "support",
      ],
      default: "engineer",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
    },

    avatar: {
      type: String,
    },

    lastLoginAt: {
      type: Date,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
