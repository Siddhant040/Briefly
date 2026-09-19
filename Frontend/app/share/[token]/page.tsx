"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import {
    accessProtectedShare,
    getSharedNote,
} from "@/features/shares/api";
import type { SharedNote } from "@/features/shares/types";

export default function SharedNotePage() {
    const params = useParams<{ token: string }>();

    const [note, setNote] = useState<SharedNote | null>(null);
    const [accessKey, setAccessKey] = useState("");
    const [isProtected, setIsProtected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadShare() {
            try {
                const data = await getSharedNote(params.token);
                setNote(data.note);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.data?.error?.code === "UNSUPPORTED_SHARE") {
                        setIsProtected(true);
                    } else {
                        setError(
                            error.response?.data?.message ||
                            "This share is invalid or no longer available."
                        );
                    }
                } else {
                    setError("This share is invalid or no longer available.");
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadShare();
    }, [params.token]);

    const handleAccess = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!accessKey.trim()) {
            toast.error("Access key is required");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            const data = await accessProtectedShare(
                params.token,
                accessKey.trim()
            );

            setNote(data.note);
            setIsProtected(false);

            toast.success("Note unlocked");
        } catch (error) {
            console.error("Failed to access protected share:", error);

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    "Invalid access key or unavailable share."
                );
            } else {
                setError("Invalid access key or unavailable share.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050505] text-[#F5F5F5]">
                <p className="text-sm text-[#737373]">Loading shared note...</p>
            </main>
        );
    }

    if (note) {
        return (
            <main className="min-h-screen bg-[#050505] text-[#F5F5F5]">
                <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
                    <div className="mb-10">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#525252]">
                            Briefly
                        </p>

                        <h1 className="mt-3 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                            {note.title}
                        </h1>
                    </div>

                    <article className="rounded-xl border border-[#292929] bg-[#080808] px-5 py-6 sm:px-8 sm:py-8">
                        <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-[#DCDCDC]">
                            {note.content}
                        </p>
                    </article>
                </div>
            </main>
        );
    }

    if (isProtected) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-[#F5F5F5]">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#525252]">
                            Briefly
                        </p>

                        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                            Protected note
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-[#737373]">
                            Enter the access key to view this note.
                        </p>
                    </div>

                    <form
                        onSubmit={handleAccess}
                        className="rounded-xl border border-[#292929] bg-[#080808] p-5 sm:p-6"
                    >
                        <label
                            htmlFor="accessKey"
                            className="mb-2 block text-sm font-medium text-[#DCDCDC]"
                        >
                            Access key
                        </label>

                        <input
                            id="accessKey"
                            type="text"
                            value={accessKey}
                            onChange={(event) => setAccessKey(event.target.value)}
                            placeholder="Enter access key"
                            className="w-full rounded-md border border-[#292929] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F5F5F5] outline-none placeholder:text-[#525252] focus:border-[#737373]"
                        />

                        {error && (
                            <p className="mt-3 text-sm text-[#A3A3A3]">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-5 w-full rounded-md bg-[#F5F5F5] px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Unlocking..." : "Unlock note"}
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-[#F5F5F5]">
            <div className="text-center">
                <p className="text-sm text-[#737373]">
                    {error || "This share is unavailable."}
                </p>
            </div>
        </main>
    );
}