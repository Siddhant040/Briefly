import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),

  email: z.string().trim().pipe(z.email()),

  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email()),

  password: z.string().min(1),
});