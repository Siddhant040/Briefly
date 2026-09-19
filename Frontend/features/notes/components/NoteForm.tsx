"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { createNoteSchema } from "../validation";

type NoteFormValues = z.infer<typeof createNoteSchema>;

type NoteFormProps = {
  onSubmit: (data: NoteFormValues) => Promise<void>;
};

export default function NoteForm({ onSubmit }: NoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(createNoteSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm text-[#A3A3A3]"
        >
          Title
        </label>

        <input
          id="title"
          type="text"
          {...register("title")}
          className="w-full rounded-md border border-[#292929] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F5F5F5] outline-none placeholder:text-[#525252] focus:border-[#737373]"
          placeholder="Enter note title"
        />

        {errors.title && (
          <p className="mt-1.5 text-sm text-[#A3A3A3]">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="mb-2 block text-sm text-[#A3A3A3]"
        >
          Content
        </label>

        <textarea
          id="content"
          {...register("content")}
          rows={10}
          className="w-full resize-y rounded-md border border-[#292929] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F5F5F5] outline-none placeholder:text-[#525252] focus:border-[#737373]"
          placeholder="Write your note..."
        />

        {errors.content && (
          <p className="mt-1.5 text-sm text-[#A3A3A3]">
            {errors.content.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#F5F5F5] px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create note"}
      </button>
    </form>
  );
}