"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AppHeader from "@/components/common/AppHeader";
import NoteForm from "@/features/notes/components/NoteForm";
import { createNote } from "@/features/notes/api";

export default function NewNotePage() {
  const router = useRouter();

  const handleCreateNote = async (data: {
    title: string;
    content: string;
  }) => {
    try {
      const note = await createNote(data);

      toast.success("Note created successfully");
      router.replace(`/notes/${note.id}`);
    } catch (error) {
      console.error("Failed to create note:", error);
      toast.error("Unable to create note");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <AppHeader />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create note
          </h1>

          <p className="mt-1 text-sm text-[#737373]">
            Write something you want to share securely.
          </p>
        </header>

        <div className="rounded-xl border border-[#292929] bg-[#050505] p-6">
          <NoteForm onSubmit={handleCreateNote} />
        </div>
      </div>
    </main>
  );
}