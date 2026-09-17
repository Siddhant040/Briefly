import argon2 from "argon2";

export const hashPassword = async (password: string) => {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
) => {
  return argon2.verify(passwordHash, password);
};