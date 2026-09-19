import { z } from "zod";

export const createShareSchema = z.object({
  shareType: z.enum(["one_time", "time_based"]),
  accessType: z.enum(["public", "password"]),
  expiresAt: z.string().min(1, "Expiry date is required"),
});
