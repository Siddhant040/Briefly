"use client";

import {
  ArrowLeft,
  Check,
  Copy,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import AppHeader from "@/components/common/AppHeader";
import { deleteNote } from "@/features/notes/api";
import { useNote } from "@/features/notes/hooks/useNote";
import { createShare, getSharesByNoteId } from "@/features/shares/api";
import CreateShareForm from "@/features/shares/components/CreateShareForm";
import ShareList from "@/features/shares/components/ShareList";
import type {
  CreateShareResponse,
  Share,
} from "@/features/shares/types";

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { note, isLoading, error } = useNote(params.id);

  const [createdShare, setCreatedShare] =
    useState<CreateShareResponse | null>(null);

  const [shares, setShares] = useState<Share[]>([]);
  const [isSharesLoading, setIsSharesLoading] = useState(true);
  const [copiedItem, setCopiedItem] = useState<
    "link" | "accessKey" | null
  >(null);

  useEffect(() => {
    async function loadShares() {
      try {
        const data = await getSharesByNoteId(params.id);
        setShares(data);
      } catch (error) {
        console.error("Failed to fetch shares:", error);
      } finally {
        setIsSharesLoading(false);
      }
    }

    loadShares();
  }, [params.id]);

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

  const handleCreateShare = async (data: {
    shareType: "one_time" | "time_based";
    accessType: "public" | "password";
    expiresAt: string;
  }) => {
    try {
      const share = await createShare(params.id, {
        ...data,
        expiresAt: new Date(data.expiresAt).toISOString(),
      });

      setCreatedShare(share);

      setShares((currentShares) => [
        {
          id: share.id,
          shareType: share.shareType,
          accessType: share.accessType,
          viewCount: 0,
          expiresAt: share.expiresAt,
          createdAt: new Date().toISOString(),
          revokedAt: null,
        },
        ...currentShares,
      ]);

      toast.success("Share link created");
    } catch (error) {
      console.error("Failed to create share:", error);
      toast.error("Unable to create share");
    }
  };

  const handleCopy = async (
    value: string,
    type: "link" | "accessKey"
  ) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopiedItem(type);

      toast.success(
        type === "link"
          ? "Share link copied"
          : "Access key copied"
      );

      window.setTimeout(() => {
        setCopiedItem(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Unable to copy");
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

            {/* Create share */}
            <section className="mt-12 border-t border-[#1A1A1A] pt-10">
              <div className="mb-7 flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#292929] bg-[#080808]">
                  <Share2 size={17} strokeWidth={1.8} />
                </div>

                <div>
                  <h2 className="text-lg font-medium tracking-tight text-[#F5F5F5]">
                    Share this note
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#737373]">
                    Create a controlled-access link for this note.
                  </p>
                </div>
              </div>

              <div className="max-w-2xl">
                <CreateShareForm onSubmit={handleCreateShare} />
              </div>

              {/* Created share */}
              {createdShare && (
                <div className="mt-8 max-w-2xl rounded-xl border border-[#292929] bg-[#080808] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#F5F5F5]">
                        Share created
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#737373]">
                        Your share is ready. Keep the access key private if
                        this link is password protected.
                      </p>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#292929] text-[#A3A3A3]">
                      <Check size={15} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Share link */}
                  <div className="mt-6">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#525252]">
                      Share link
                    </p>

                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#292929] bg-[#050505] p-2">
                      <p className="min-w-0 flex-1 break-all px-2 text-sm leading-6 text-[#A3A3A3]">
                        {`${window.location.origin}/share/${createdShare.shareToken}`}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            `${window.location.origin}/share/${createdShare.shareToken}`,
                            "link"
                          )
                        }
                        className="inline-flex shrink-0 items-center gap-2 rounded-md border border-[#292929] px-3 py-2 text-xs text-[#A3A3A3] transition-colors hover:border-[#525252] hover:bg-[#0A0A0A] hover:text-[#F5F5F5]"
                      >
                        {copiedItem === "link" ? (
                          <Check size={14} strokeWidth={2} />
                        ) : (
                          <Copy size={14} strokeWidth={1.8} />
                        )}

                        {copiedItem === "link" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Access key */}
                  {createdShare.accessKey && (
                    <div className="mt-5">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#525252]">
                        Access key
                      </p>

                      <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#292929] bg-[#050505] p-2">
                        <p className="min-w-0 flex-1 break-all px-2 font-mono text-sm text-[#F5F5F5]">
                          {createdShare.accessKey}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              createdShare.accessKey!,
                              "accessKey"
                            )
                          }
                          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-[#292929] px-3 py-2 text-xs text-[#A3A3A3] transition-colors hover:border-[#525252] hover:bg-[#0A0A0A] hover:text-[#F5F5F5]"
                        >
                          {copiedItem === "accessKey" ? (
                            <Check size={14} strokeWidth={2} />
                          ) : (
                            <Copy size={14} strokeWidth={1.8} />
                          )}

                          {copiedItem === "accessKey"
                            ? "Copied"
                            : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Existing shares */}
            <section className="mt-12 border-t border-[#1A1A1A] pt-10">
              <div className="mb-7">
                <h2 className="text-lg font-medium tracking-tight text-[#F5F5F5]">
                  Existing shares
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#737373]">
                  View and manage links created for this note.
                </p>
              </div>

              {isSharesLoading ? (
                <div className="rounded-xl border border-[#292929] bg-[#080808] px-6 py-10 text-center">
                  <p className="text-sm text-[#737373]">
                    Loading shares...
                  </p>
                </div>
              ) : (
                <ShareList
                  shares={shares}
                  onRevoked={(shareId) => {
                    setShares((currentShares) =>
                      currentShares.map((share) =>
                        share.id === shareId
                          ? {
                              ...share,
                              revokedAt: new Date().toISOString(),
                            }
                          : share
                      )
                    );
                  }}
                />
              )}
            </section>
          </article>
        )}
      </div>
    </main>
  );
}