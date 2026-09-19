"use client";

import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import AppHeader from "@/components/common/AppHeader";
import { deleteNote } from "@/features/notes/api";
import { useNote } from "@/features/notes/hooks/useNote";

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { note, isLoading, error } = useNote(params.id);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteNote(params.id);

      toast.success("Note deleted successfully");
      router.replace("/");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Unable to delete note");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <AppHeader />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Back navigation */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#737373] transition-colors hover:text-[#F5F5F5]"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to notes
        </Link>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-xl border border-[#292929] bg-[#080808] px-6 py-20 text-center">
            <p className="text-sm text-[#737373]">
              Loading note...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-xl border border-[#292929] bg-[#080808] px-6 py-16 text-center">
            <p className="text-sm text-[#A3A3A3]">
              {error}
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 text-sm text-[#F5F5F5] underline underline-offset-4"
            >
              Return to notes
            </Link>
          </div>
        )}

        {/* Note */}
        {!isLoading && !error && note && (
          <article>
            {/* Note header */}
            <header className="border-b border-[#1A1A1A] pb-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                    {note.title}
                  </h1>

                  <p className="mt-3 text-sm text-[#525252]">
                    Last updated{" "}
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/notes/${note.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-md border border-[#292929] px-3 py-2 text-sm text-[#A3A3A3] transition-colors hover:border-[#525252] hover:bg-[#0A0A0A] hover:text-[#F5F5F5]"
                  >
                    <Pencil size={15} strokeWidth={1.8} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 rounded-md border border-[#292929] px-3 py-2 text-sm text-[#A3A3A3] transition-colors hover:border-[#525252] hover:bg-[#0A0A0A] hover:text-[#F5F5F5]"
                  >
                    <Trash2 size={15} strokeWidth={1.8} />
                    Delete
                  </button>
                </div>
              </div>
            </header>

            {/* Note content */}
            <section className="pt-8">
              <div className="rounded-xl border border-[#1F1F1F] bg-[#080808] px-5 py-6 sm:px-8 sm:py-8">
                <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-[#DCDCDC]">
                  {note.content}
                </p>
              </div>
            </section>
          </article>
        )}
      </div>
    </main>
  );
}