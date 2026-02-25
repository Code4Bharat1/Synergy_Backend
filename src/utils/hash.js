import bcrypt from "bcryptjs";

/* ---------------- HASH PASSWORD ---------------- */
export const hashPassword = async (password) => {
  const saltRounds = 10; // production safe default
  return await bcrypt.hash(password, saltRounds);
};

/* ---------------- COMPARE PASSWORD ---------------- */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
