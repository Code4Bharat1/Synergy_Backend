import {
  loginService,
  logoutService,
  refreshService,
} from "../services/auth.service.js";

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await loginService(
      email,
      password,
    );

    // HttpOnly refresh cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
    });

    return res.json({
      accessToken,
      user, // role included automatically from DB
    });
  } catch (err) {
    return res.status(err.statusCode || 400).json({
      message: err.message || "Login failed",
    });
  }
};

/* ---------------- REFRESH ---------------- */
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const { newAccessToken, newRefreshToken } =
      await refreshService(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
    });

    return res.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(err.statusCode || 403).json({
      message: err.message || "Invalid or expired refresh token",
    });
  }
};

/* ---------------- LOGOUT ---------------- */
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await logoutService(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    return res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
