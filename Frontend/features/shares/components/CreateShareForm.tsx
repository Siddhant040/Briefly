"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { createShareSchema } from "../validation";

type CreateShareFormValues = z.infer<typeof createShareSchema>;

type CreateShareFormProps = {
    onSubmit: (data: CreateShareFormValues) => Promise<void>;
};

export default function CreateShareForm({
    onSubmit,
}: CreateShareFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateShareFormValues>({
        resolver: zodResolver(createShareSchema),
        defaultValues: {
            shareType: "time_based",
            accessType: "public",
            expiresAt: "",
        },
    });

    const shareType = watch("shareType");
    const accessType = watch("accessType");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="mb-3 block text-sm font-medium text-[#DCDCDC]">
                    Share type
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                    <label

                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${shareType === "one_time"
                            ? "border-[#F5F5F5] bg-[#0A0A0A]"
                            : "border-[#292929] hover:border-[#525252]"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                value="one_time"
                                {...register("shareType")}
                                className="mt-1"
                            />

                            <div>
                                <p className="text-sm font-medium text-[#F5F5F5]">
                                    One-time
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#737373]">
                                    The link can only be successfully accessed once.
                                </p>
                            </div>
                        </div>
                    </label>

                    <label
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${shareType === "time_based"
                            ? "border-[#F5F5F5] bg-[#0A0A0A]"
                            : "border-[#292929] hover:border-[#525252]"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                value="time_based"
                                {...register("shareType")}
                                className="mt-1"
                            />

                            <div>
                                <p className="text-sm font-medium text-[#F5F5F5]">
                                    Time-based
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#737373]">
                                    The link remains available until it expires.
                                </p>
                            </div>
                        </div>
                    </label>
                </div>

                {errors.shareType && (
                    <p className="mt-2 text-sm text-[#A3A3A3]">
                        {errors.shareType.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-3 block text-sm font-medium text-[#DCDCDC]">
                    Access type
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                    <label
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${accessType === "public"
                            ? "border-[#F5F5F5] bg-[#0A0A0A]"
                            : "border-[#292929] hover:border-[#525252]"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                value="public"
                                {...register("accessType")}
                                className="mt-1"
                            />

                            <div>
                                <p className="text-sm font-medium text-[#F5F5F5]">
                                    Public
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#737373]">
                                    Anyone with the link can access the note.
                                </p>
                            </div>
                        </div>
                    </label>

                    <label
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${accessType === "password"
                                ? "border-[#F5F5F5] bg-[#0A0A0A]"
                                : "border-[#292929] hover:border-[#525252]"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                value="password"
                                {...register("accessType")}
                                className="mt-1"
                            />

                            <div>
                                <p className="text-sm font-medium text-[#F5F5F5]">
                                    Password protected
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#737373]">
                                    Access requires a generated access key.
                                </p>
                            </div>
                        </div>
                    </label>
                </div>

                {errors.accessType && (
                    <p className="mt-2 text-sm text-[#A3A3A3]">
                        {errors.accessType.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="expiresAt"
                    className="mb-2 block text-sm font-medium text-[#DCDCDC]"
                >
                    Expires at
                </label>

                <input
                    id="expiresAt"
                    type="datetime-local"
                    {...register("expiresAt")}
                    className="w-full rounded-md border border-[#292929] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F5F5F5] outline-none focus:border-[#737373]"
                />

                {errors.expiresAt && (
                    <p className="mt-2 text-sm text-[#A3A3A3]">
                        {errors.expiresAt.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-[#F5F5F5] px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? "Creating share..." : "Create share"}
            </button>
        </form>
    );
}