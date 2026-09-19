import type { ApiResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import type { CreateNoteRequest, Note, NoteDetail, UpdateNoteRequest } from "./types";

export async function getNotes(): Promise<Note[]> {
  const response = await apiClient.get<ApiResponse<Note[]>>("/notes");
  return response.data.data;
}

export async function createNote(data: CreateNoteRequest): Promise<Note> {
  const response = await apiClient.post<ApiResponse<Note>>("/notes", data);
  return response.data.data;
}

export async function getNoteById(id: string): Promise<NoteDetail> {
  const response = await apiClient.get<ApiResponse<NoteDetail>>(
    `/notes/${id}`
  );

  return response.data.data;
}

export async function updateNote(
  id: string,
  data: UpdateNoteRequest
): Promise<NoteDetail> {
  const response = await apiClient.patch<ApiResponse<NoteDetail>>(
    `/notes/${id}`,
    data
  );

  return response.data.data;
}

export async function deleteNote(id: string): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(`/notes/${id}`);
}