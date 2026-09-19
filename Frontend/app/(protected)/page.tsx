"use client";

import Link from "next/link";

import { Plus } from "lucide-react";

import AppHeader from "@/components/common/AppHeader";
import NotesList from "@/features/notes/components/NotesList";
import { useNotes } from "@/features/notes/hooks/useNotes";

export default function HomePage() {
  const { notes, isLoading, error } = useNotes();

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#525252]">
              Workspace
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Your notes
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#737373]">
              Create, manage, and securely share your notes.
            </p>
          </div>

          <Link
            href="/notes/new"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-[#F5F5F5] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white"
          >
            <Plus size={16} strokeWidth={2} />
            Create note
          </Link>
        </header>

        <section className="mt-10">
          {isLoading && (
            <div className="rounded-xl border border-[#292929] px-6 py-16 text-center">
              <p className="text-sm text-[#737373]">
                Loading your notes...
              </p>
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-xl border border-[#292929] px-6 py-16 text-center">
              <p className="text-sm text-[#A3A3A3]">{error}</p>
            </div>
          )}

          {!isLoading && !error && <NotesList notes={notes} />}
        </section>
      </div>
    </main>
  );
}