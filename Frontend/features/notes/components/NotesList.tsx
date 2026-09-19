import type { Note } from "../types";
import NoteCard from "./NoteCard";

type NotesListProps = {
  notes: Note[];
};

export default function NotesList({ notes }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-xl border border-[#292929] bg-[#050505] px-6 py-12 text-center">
        <p className="text-sm text-[#8A8A8A]">
          You don&apos;t have any notes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}