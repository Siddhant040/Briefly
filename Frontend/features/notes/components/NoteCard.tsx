"use client";

import Link from "next/link";

import type { Note } from "../types";

type NoteCardProps = {
  note: Note;
};

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="block rounded-xl border border-[#292929] bg-[#050505] p-5 transition-colors hover:border-[#DCDCDC]/40"
    >
      <h2 className="truncate text-base font-medium text-[#F5F5F5]">
        {note.title}
      </h2>

      <p className="mt-2 text-sm text-[#737373]">
        Updated {new Date(note.updatedAt).toLocaleDateString()}
      </p>
    </Link>
  );
}