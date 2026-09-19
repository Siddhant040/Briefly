import { db } from "../../db/index.js";
import { notes } from "./Notes.schema.js";
import { desc ,eq, and } from "drizzle-orm";
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

export const getNotes = async (userId: string) => {
  const userNotes = await db
    .select({
      id: notes.id,
      title: notes.title,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.updatedAt));

  return userNotes;
};