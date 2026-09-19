"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import AppHeader from "@/components/common/AppHeader";
import EditNoteForm from "@/features/notes/components/EditNoteForm";
import { updateNote } from "@/features/notes/api";
import { useNote } from "@/features/notes/hooks/useNote";

export default function EditNotePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { note, isLoading, error } = useNote(params.id);

  const handleUpdateNote = async (data: {
    title: string;
    content: string;
  }) => {
    try {
      await updateNote(params.id, data);

      toast.success("Note updated successfully");
      router.replace(`/notes/${params.id}`);
    } catch (error) {
      console.error("Failed to update note:", error);
      toast.error("Unable to update note");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <AppHeader />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <Link
            href={`/notes/${params.id}`}
            className="text-sm text-[#737373] hover:text-[#F5F5F5]"
          >
            ← Back to note
          </Link>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Edit note
          </h1>
        </header>

        {isLoading && (
          <div className="rounded-xl border border-[#292929] px-6 py-12 text-center">
            <p className="text-sm text-[#737373]">
              Loading note...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-[#292929] px-6 py-12 text-center">
            <p className="text-sm text-[#A3A3A3]">{error}</p>
          </div>
        )}

        {!isLoading && !error && note && (
          <div className="rounded-xl border border-[#292929] bg-[#050505] p-6">
            <EditNoteForm
              defaultValues={{
                title: note.title,
                content: note.content,
              }}
              onSubmit={handleUpdateNote}
            />
          </div>
        )}
      </div>
    </main>
  );
}