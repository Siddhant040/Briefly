import {
  pgEnum,
  pgTable,
  integer,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { notes } from "../Notes/Notes.schema.js";

export const shareTypeEnum = pgEnum("share_type", [
  "one_time",
  "time_based",
]);

export const accessTypeEnum = pgEnum("access_type", [
  "public",
  "password",
]);

export const shares = pgTable("shares", {
  id: uuid("id").primaryKey().defaultRandom(),

  noteId: uuid("note_id")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),

  tokenHash: text("token_hash").notNull().unique(),

  shareType: shareTypeEnum("share_type").notNull(),

  accessType: accessTypeEnum("access_type").notNull(),

  passwordHash: text("password_hash"),

  viewCount: integer("view_count").default(0).notNull(),

  usedAt: timestamp("used_at"),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  revokedAt: timestamp("revoked_at"),
});