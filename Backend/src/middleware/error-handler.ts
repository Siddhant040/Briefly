import type { ErrorHandler } from "hono";
import { ApiError } from "../utils/api-error.js";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errorHandler: ErrorHandler = (error, c) => {
  if (error instanceof ApiError) {
    return c.json(
      {
        success: false,
        message: error.message,
        error: {
          code: error.code,
        },
      },
      error.statusCode as ContentfulStatusCode,
    );
  }

  console.error(error);

  return c.json(
    {
      success: false,
      message: "Internal server error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
      },
    },
    500,
  );
};