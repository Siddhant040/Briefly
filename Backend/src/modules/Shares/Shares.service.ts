import { db } from "../../db/index.js";
import { shares } from "./Shares.schema.js";
import { and, eq, gt, isNull,sql ,desc} from "drizzle-orm";
import { hashPassword } from "../Users/Users.security.js";
import { notes } from "../Notes/Notes.schema.js";
import {
  generateShareToken,
  hashShareToken,
  generateAccessKey,
} from "./Shares.security.js";

export const createShare = async (
  noteId: string,
  shareType: "one_time" | "time_based",
  accessType: "public" | "password",
  expiresAt: Date,
) => {
  const token = generateShareToken();
  const tokenHash = hashShareToken(token);

  let accessKey: string | undefined;
  let passwordHash: string | undefined;

  if (accessType === "password") {
    accessKey = generateAccessKey();
    passwordHash = await hashPassword(accessKey);
  }

  const values = {
    noteId,
    tokenHash,
    shareType,
    accessType,
    expiresAt,
    ...(passwordHash !== undefined && { passwordHash }),
  };

  const [share] = await db
    .insert(shares)
    .values(values)
    .returning();

  if (!share) {
    throw new Error("Failed to create share");
  }

  return {
    share,
    token,
    accessKey,
  };
};
export const findShareByToken = async (token: string) => {
  const tokenHash = hashShareToken(token);

  const [share] = await db
    .select({
      id: shares.id,
      noteId: shares.noteId,
      shareType: shares.shareType,
      accessType: shares.accessType,
      passwordHash: shares.passwordHash,
      viewCount: shares.viewCount,
      usedAt: shares.usedAt,
      expiresAt: shares.expiresAt,
      revokedAt: shares.revokedAt,

      noteTitle: notes.title,
      noteContent: notes.content,
    })
    .from(shares)
    .innerJoin(notes, eq(shares.noteId, notes.id))
    .where(
      and(
        eq(shares.tokenHash, tokenHash),
        isNull(shares.revokedAt),
        gt(shares.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return share ?? null;
};
export const consumeOneTimeShare = async (shareId: string) => {
  const [share] = await db
    .update(shares)
    .set({
      usedAt: new Date(),
      viewCount: sql`${shares.viewCount} + 1`,
    })
    .where(
      and(
        eq(shares.id, shareId),
        eq(shares.shareType, "one_time"),
        isNull(shares.usedAt),
        isNull(shares.revokedAt),
        gt(shares.expiresAt, new Date()),
      ),
    )
    .returning();

  return share ?? null;
};
export const recordTimeBasedView = async (shareId: string) => {
  const [share] = await db
    .update(shares)
    .set({
      viewCount: sql`${shares.viewCount} + 1`,
    })
    .where(
      and(
        eq(shares.id, shareId),
        eq(shares.shareType, "time_based"),
        isNull(shares.revokedAt),
        gt(shares.expiresAt, new Date()),
      ),
    )
    .returning();

  return share ?? null;
};
export const revokeShare = async (
  shareId: string,
  userId: string,
) => {
  const [share] = await db
    .select({
      id: shares.id,
      noteUserId: notes.userId,
    })
    .from(shares)
    .innerJoin(notes, eq(shares.noteId, notes.id))
    .where(eq(shares.id, shareId))
    .limit(1);

  if (!share || share.noteUserId !== userId) {
    return null;
  }

  const [revokedShare] = await db
    .update(shares)
    .set({
      revokedAt: new Date(),
    })
    .where(
      and(
        eq(shares.id, shareId),
        isNull(shares.revokedAt),
      ),
    )
    .returning();

  return revokedShare ?? null;
};

export const getSharesByNoteId = async (
  noteId: string,
  userId: string,
) => {
  const result = await db
    .select({
      id: shares.id,
      shareType: shares.shareType,
      accessType: shares.accessType,
      viewCount: shares.viewCount,
      expiresAt: shares.expiresAt,
      createdAt: shares.createdAt,
      revokedAt: shares.revokedAt,
    })
    .from(shares)
    .innerJoin(notes, eq(shares.noteId, notes.id))
    .where(
      and(
        eq(shares.noteId, noteId),
        eq(notes.userId, userId),
      ),
    )
    .orderBy(desc(shares.createdAt));

  return result;
};