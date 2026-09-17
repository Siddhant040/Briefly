import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1).max(200),

  content: z.string().min(1),
});

export const updateNoteSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.content !== undefined,
    {
      message: "At least one field is required",
    },
  );