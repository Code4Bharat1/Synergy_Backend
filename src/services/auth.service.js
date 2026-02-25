import { User } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/token.js";


export const registerService = async (email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        email,
        password: hashedPassword
    });

    return {
        id: user._id,
        email: user.email,
        role: user.role
    };
};

/* ---------------- LOGIN SERVICE ---------------- */
export const loginService = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            email: user.email,
            role: user.role
        }
    };
};


/* ---------------- REFRESH SERVICE ---------------- */
export const refreshService = async (refreshToken) => {
    if (!refreshToken) throw new Error("Unauthorized");

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken)
        throw new Error("Forbidden");

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
        newAccessToken,
        newRefreshToken
    };
};


/* ---------------- LOGOUT SERVICE ---------------- */
export const logoutService = async (refreshToken) => {
    if (!refreshToken) return;

    await User.updateOne(
        { refreshToken },
        { $set: { refreshToken: null } }
    );
};
