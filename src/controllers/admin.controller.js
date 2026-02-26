import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../services/admin.service.js";

/* ---------------- CREATE USER ---------------- */
export const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

/* ---------------- GET ALL USERS ---------------- */
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();

    return res.json(users);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Failed to fetch users",
    });
  }
};

/* ---------------- GET SINGLE USER ---------------- */
export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);

    return res.json(user);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

/* ---------------- UPDATE USER ---------------- */
export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.params.id, req.body);

    return res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

/* ---------------- DELETE USER ---------------- */
export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);

    return res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};
