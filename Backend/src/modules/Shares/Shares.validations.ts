import { z } from "zod";

export const createShareSchema = z.object({
  shareType: z.enum(["one_time", "time_based"]),

  accessType: z.enum(["public", "password"]),

  expiresAt: z.coerce.date().refine(
    (date) => date > new Date(),
    {
      message: "Expiry date must be in the future",
    },
  ),
});
export const accessShareSchema = z.object({
  accessKey: z.string().min(1),
});