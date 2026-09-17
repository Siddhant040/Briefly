import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";

import { findSessionByToken } from "../modules/Users/Session.service.js";
import { ApiError } from "../utils/api-error.js";

declare module "hono" {
  interface ContextVariableMap {
    user: {
      id: string;
      name: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}

export const authMiddleware = async (
  c: Context,
  next: Next,
) => {
  const token = getCookie(c, "session");

  if (!token) {
    throw new ApiError(
      "Authentication required",
      401,
      "UNAUTHORIZED",
    );
  }

  const session = await findSessionByToken(token);

  if (!session) {
    throw new ApiError(
      "Invalid or expired session",
      401,
      "UNAUTHORIZED",
    );
  }

  c.set("user", session.user);

  await next();
};