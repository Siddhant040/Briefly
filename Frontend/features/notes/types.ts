export type Note = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};
export type CreateNoteRequest = {
  title: string;
  content: string;
};
export type NoteDetail = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
export type UpdateNoteRequest = {
  title: string;
  content: string;
};