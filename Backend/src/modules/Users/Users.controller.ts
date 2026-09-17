import type { Context } from "hono";
import { setCookie,getCookie, deleteCookie  } from "hono/cookie";
import { registerSchema, loginSchema } from "./Users.validation.js";
import { createUser, findUserByEmail } from "./Users.service.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { verifyPassword } from "./Users.security.js";
import { createSession, revokeSession } from "./Session.service.js";

export const register = async (c: Context) => {
  const body = await c.req.json();

  const result = registerSchema.safeParse(body);

  if (!result.success) {
    throw new ApiError(
      "Invalid registration data",
      400,
      "VALIDATION_ERROR",
    );
  }

  const { name, email, password } = result.data;

  const user = await createUser(name, email, password);

  return c.json(
    ApiResponse.success("User registered successfully", user),
    201,
  );
};

export const login = async (c: Context) => {
  const body = await c.req.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    throw new ApiError(
      "Invalid login data",
      400,
      "VALIDATION_ERROR",
    );
  }

  const { email, password } = result.data;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(
      "Invalid email or password",
      404,
      "INVALID_CREDENTIALS",
    );
  }
  const passwordMatch = await verifyPassword(password, user.passwordHash);

  if (!passwordMatch) {
    throw new ApiError(
      "Invalid password",
      401,
      "INVALID_PASSWORD",
    );
  }

  const { token, expiresAt } = await createSession(user.id);

  setCookie(c, "session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
   const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return c.json(
    ApiResponse.success("User logged in successfully", safeUser),
  );
};
export const me = async (c: Context) => {
  const user = c.get("user");

  return c.json(
    ApiResponse.success(
      "User fetched successfully",
      user,
    ),
  );
};
export const logout = async (c: Context) => {
  const token = getCookie(c, "session");

  if (token) {
    await revokeSession(token);
  }

  deleteCookie(c, "session", {
    path: "/",
  });

  return c.json(
    ApiResponse.success("User logged out successfully"),
  );
};