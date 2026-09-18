import type { Context } from "hono";

import { createShareSchema, accessShareSchema } from "./Shares.validations.js";
import { createShare, findShareByToken, consumeOneTimeShare,recordTimeBasedView,revokeShare } from "./Shares.service.js";
import {verifyShareAccessKey} from "./Shares.security.js";

import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { getNoteById } from "../Notes/Notes.service.js";
export const create = async (c: Context) => {
  const noteId = c.req.param("id");

  if (!noteId) {
    throw new ApiError(
      "Note ID is required",
      400,
      "NOTE_ID_REQUIRED",
    );
  }

  const body = await c.req.json();

  const result = createShareSchema.safeParse(body);

  if (!result.success) {
    throw new ApiError(
      "Invalid share data",
      400,
      "VALIDATION_ERROR",
    );
  }

  const user = c.get("user");

  // Ownership check will be added through the note lookup.
  const note = await getNoteById(noteId, user.id);

if (!note) {
  throw new ApiError(
    "Note not found",
    404,
    "NOTE_NOT_FOUND",
  );
}
const {
  shareType,
  accessType,
  expiresAt,
} = result.data;

const { share, token, accessKey } = await createShare(
  noteId,
  shareType,
  accessType,
  expiresAt,
);
return c.json(
  ApiResponse.success(
    "Share created successfully",
    {
      id: share.id,
      shareType: share.shareType,
      accessType: share.accessType,
      expiresAt: share.expiresAt,
      shareToken: token,
      accessKey,
    },
  ),
  201,
);
};



export const accessShare = async (c: Context) => {
  const token = c.req.param("token");

  if (!token) {
    throw new ApiError(
      "Share token is required",
      400,
      "SHARE_TOKEN_REQUIRED",
    );
  }

  const share = await findShareByToken(token);

  if (!share) {
    throw new ApiError(
      "Invalid, expired, or revoked share",
      404,
      "SHARE_NOT_FOUND",
    );
  }

  // One-time + Public
  if (
    share.shareType === "one_time" &&
    share.accessType === "public"
  ) {
    const consumedShare = await consumeOneTimeShare(share.id);

    if (!consumedShare) {
      throw new ApiError(
        "This share has already been used",
        410,
        "SHARE_ALREADY_USED",
      );
    }

    return c.json(
      ApiResponse.success(
        "Share accessed successfully",
        {
          note: {
            title: share.noteTitle,
            content: share.noteContent,
          },
        },
      ),
    );
  }

  // Time-based + Public
  if (
    share.shareType === "time_based" &&
    share.accessType === "public"
  ) {
    const updatedShare = await recordTimeBasedView(share.id);

    if (!updatedShare) {
      throw new ApiError(
        "Share has expired or is no longer available",
        410,
        "SHARE_EXPIRED",
      );
    }

    return c.json(
      ApiResponse.success(
        "Share accessed successfully",
        {
          note: {
            title: share.noteTitle,
            content: share.noteContent,
          },
        },
      ),
    );
  }

  throw new ApiError(
    "Unsupported share type",
    400,
    "UNSUPPORTED_SHARE",
  );
};

export const accessProtectedShare = async (c: Context) => {
  const token = c.req.param("token");

  if (!token) {
    throw new ApiError(
      "Share token is required",
      400,
      "SHARE_TOKEN_REQUIRED",
    );
  }

  const body = await c.req.json();

  const result = accessShareSchema.safeParse(body);

  if (!result.success) {
    throw new ApiError(
      "Access key is required",
      400,
      "VALIDATION_ERROR",
    );
  }

  const share = await findShareByToken(token);

  if (!share) {
    throw new ApiError(
      "Invalid, expired, or revoked share",
      404,
      "SHARE_NOT_FOUND",
    );
  }

  if (
    share.shareType !== "time_based" ||
    share.accessType !== "password"
  ) {
    throw new ApiError(
      "Unsupported share type",
      400,
      "UNSUPPORTED_SHARE",
    );
  }

  const isValid = await verifyShareAccessKey(
    share.passwordHash,
    result.data.accessKey,
  );

  if (!isValid) {
    throw new ApiError(
      "Invalid access key",
      401,
      "INVALID_ACCESS_KEY",
    );
  }

  const updatedShare = await recordTimeBasedView(share.id);

  if (!updatedShare) {
    throw new ApiError(
      "Share has expired or is no longer available",
      410,
      "SHARE_EXPIRED",
    );
  }

  return c.json(
    ApiResponse.success(
      "Share accessed successfully",
      {
        note: {
          title: share.noteTitle,
          content: share.noteContent,
        },
      },
    ),
  );
};

export const revoke = async (c: Context) => {
  const shareId = c.req.param("id");

  if (!shareId) {
    throw new ApiError(
      "Share ID is required",
      400,
      "SHARE_ID_REQUIRED",
    );
  }

  const user = c.get("user");

  const share = await revokeShare(
    shareId,
    user.id,
  );

  if (!share) {
    throw new ApiError(
      "Share not found",
      404,
      "SHARE_NOT_FOUND",
    );
  }

  return c.json(
    ApiResponse.success(
      "Share revoked successfully",
      {
        id: share.id,
        revokedAt: share.revokedAt,
      },
    ),
  );
};