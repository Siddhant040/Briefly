import { db } from "../../db/index.js";
import { notes } from "./Notes.schema.js";
import { eq, and } from "drizzle-orm";
export const createNote = async (
  userId: string,
  title: string,
  content: string,
) => {
  const [note] = await db
    .insert(notes)
    .values({
      userId,
      title,
      content,
    })
    .returning();

  return note;
};
export const getNoteById = async (
  noteId: string,
  userId: string,
) => {
  const [note] = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.id, noteId),
        eq(notes.userId, userId),
      ),
    )
    .limit(1);

  return note ?? null;
};

export const updateNote = async (
  noteId: string,
  userId: string,
  data: {
    title?: string|undefined
    content?: string | undefined;
  },
) => {
  const [note] = await db
    .update(notes)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notes.id, noteId),
        eq(notes.userId, userId),
      ),
    )
    .returning();

  return note ?? null;
};
export const deleteNote = async (
  noteId: string,
  userId: string,
) => {
  const [note] = await db
    .delete(notes)
    .where(
      and(
        eq(notes.id, noteId),
        eq(notes.userId, userId),
      ),
    )
    .returning({
      id: notes.id,
    });

  return note ?? null;
};