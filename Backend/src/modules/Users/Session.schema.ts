import {
  pgTable,
  timestamp,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import { users } from "./Users.schema.js";

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  tokenHash: text("token_hash").notNull().unique(),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  revokedAt: timestamp("revoked_at"),
});