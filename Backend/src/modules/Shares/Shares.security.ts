import { createHash, randomBytes } from "node:crypto";
import { verifyPassword } from "../Users/Users.security.js";

export const generateShareToken = () => {
  return randomBytes(32).toString("hex");
};

export const hashShareToken = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};

export const generateAccessKey = () => {
  return randomBytes(16).toString("hex");
};
export const verifyShareAccessKey = async (
  passwordHash: string | null,
  accessKey: string,
) => {
  if (!passwordHash) {
    return false;
  }

  return verifyPassword(accessKey, passwordHash);
};
