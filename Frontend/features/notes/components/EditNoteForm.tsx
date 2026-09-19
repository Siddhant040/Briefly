"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { createNoteSchema } from "../validation";

type EditNoteFormValues = z.infer<typeof createNoteSchema>;

type EditNoteFormProps = {
  defaultValues: EditNoteFormValues;
  onSubmit: (data: EditNoteFormValues) => Promise<void>;
};

export default function EditNoteForm({
  defaultValues,
  onSubmit,
}: EditNoteFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditNoteFormValues>({
    resolver: zodResolver(createNoteSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

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
          rows={12}
          {...register("content")}
          className="w-full resize-y rounded-md border border-[#292929] bg-[#0A0A0A] px-4 py-3 text-sm leading-7 text-[#F5F5F5] outline-none placeholder:text-[#525252] focus:border-[#737373]"
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
        {isSubmitting ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}