"use client";

import { useEffect, useState } from "react";

import { getNotes } from "../api";
import type { Note } from "../types";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNotes() {
      try {
        const data = await getNotes();

        if (!cancelled) {
          setNotes(data);
        }
      } catch (error) {
        console.error("Failed to fetch notes:", error);

        if (!cancelled) {
          setError("Unable to load your notes.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadNotes();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    notes,
    isLoading,
    error,
  };
}