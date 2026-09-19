"use client";

import { useEffect, useState } from "react";

import { getNoteById } from "../api";
import type { NoteDetail } from "../types";

export function useNote(id: string) {
  const [note, setNote] = useState<NoteDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNote() {
      try {
        const data = await getNoteById(id);

        if (!cancelled) {
          setNote(data);
        }
      } catch (error) {
        console.error("Failed to fetch note:", error);

        if (!cancelled) {
          setError("Unable to load this note.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadNote();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    note,
    isLoading,
    error,
  };
}