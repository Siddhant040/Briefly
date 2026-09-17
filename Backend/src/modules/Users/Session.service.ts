import { db } from "../../db/index.js";
import { sessions } from "./Session.schema.js";
import { randomBytes, createHash } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { users } from "./Users.schema.js";

export const generateSessionToken = () => {
  return randomBytes(32).toString("hex");
};

export const hashSessionToken = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};

export const createSession = async (userId: string) => {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);

  const expiresAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7,
  );

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  return {
    token,
    expiresAt,
  };
};
export const findSessionByToken = async (token: string) => {
  const tokenHash = hashSessionToken(token);

  const [result] = await db
    .select({
      session: sessions,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return result ?? null;
};
export const revokeSession = async (token: string) => {
  const tokenHash = hashSessionToken(token);

  await db
    .update(sessions)
    .set({
      revokedAt: new Date(),
    })
    .where(eq(sessions.tokenHash, tokenHash));
};