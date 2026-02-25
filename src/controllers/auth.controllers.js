import {
  loginService,
  logoutService,
  refreshService,
  registerService,
} from "../services/auth.service.js";

/* ---------------- REGISTER ---------------- */
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await registerService(email, password);

    return res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } =
      await loginService(email, password);

    // Set HttpOnly refresh cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    });

    return res.json({
      accessToken,
      user
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message || "Login failed"
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
      sameSite: "strict",
      path: "/"
    });

    return res.json({
      accessToken: newAccessToken
    });

  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired refresh token"
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await logoutService(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      path: "/"
    });

    return res.json({ message: "Logged out successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Logout failed"
    });
  }
};
