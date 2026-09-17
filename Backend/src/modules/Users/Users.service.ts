import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "./Users.schema.js";
import { hashPassword } from "./Users.security.js";
import { ApiError } from "../../utils/api-error.js";

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new ApiError(
      "User with this email already exists",
      409,
      "USER_ALREADY_EXISTS",
    );
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  if (!user) {
    throw new ApiError(
      "Failed to create user",
      500,
      "USER_CREATION_FAILED",
    );
  }

  return user;
};

export const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
};

export const findUserById = async (id: string) => {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user ?? null;
};