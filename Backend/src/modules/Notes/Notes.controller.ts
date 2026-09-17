import type { Context } from "hono";

import { createNoteSchema , updateNoteSchema} from "./Notes.validation.js";
import { createNote , getNoteById, updateNote,deleteNote} from "./Notes.service.js";

import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";



/**
 * 
 */
export const create = async (c: Context) => {
  const body = await c.req.json();

  const result = createNoteSchema.safeParse(body);

  if (!result.success) {
    throw new ApiError(
      "Invalid note data",
      400,
      "VALIDATION_ERROR",
    );
  }

  const { title, content } = result.data;

  const user = c.get("user");

  const note = await createNote(
    user.id,
    title,
    content,
  );

  return c.json(
    ApiResponse.success(
      "Note created successfully",
      note,
    ),
    201,
  );
};


export const getById = async (c: Context) => {
  const noteId = c.req.param("id");

  if (!noteId) {
    throw new ApiError(
      "Note ID is required",
      400,
      "NOTE_ID_REQUIRED",
    );
  }

  const user = c.get("user");

  const note = await getNoteById(noteId, user.id);

  if (!note) {
    throw new ApiError(
      "Note not found",
      404,
      "NOTE_NOT_FOUND",
    );
  }

  return c.json(
    ApiResponse.success(
      "Note fetched successfully",
      note,
    ),
  );
};

export const update = async (c: Context) => {
  const noteId = c.req.param("id");

  if (!noteId) {
    throw new ApiError(
      "Note ID is required",
      400,
      "NOTE_ID_REQUIRED",
    );
  }

  const body = await c.req.json();

  const result = updateNoteSchema.safeParse(body);

  if (!result.success) {
    throw new ApiError(
      "Invalid note data",
      400,
      "VALIDATION_ERROR",
    );
  }

  const user = c.get("user");

  const note = await updateNote(
    noteId,
    user.id,
    result.data,
  );

  if (!note) {
    throw new ApiError(
      "Note not found",
      404,
      "NOTE_NOT_FOUND",
    );
  }

  return c.json(
    ApiResponse.success(
      "Note updated successfully",
      note,
    ),
  );
};

export const remove = async (c: Context) => {
  const noteId = c.req.param("id");

  if (!noteId) {
    throw new ApiError(
      "Note ID is required",
      400,
      "NOTE_ID_REQUIRED",
    );
  }

  const user = c.get("user");

  const note = await deleteNote(
    noteId,
    user.id,
  );

  if (!note) {
    throw new ApiError(
      "Note not found",
      404,
      "NOTE_NOT_FOUND",
    );
  }

  return c.json(
    ApiResponse.success(
      "Note deleted successfully",
    ),
  );
};