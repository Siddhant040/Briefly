"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { register as registerUser } from "../api";
import { registerSchema } from "../validation";
import type { RegisterRequest } from "../types";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    setServerError("");

    try {
      const user = await registerUser(data);

      console.log("Registered user:", user);

      toast.success("Account created successfully");
      router.replace("/login")
    } catch (error) {
      console.error("Registration failed:", error);

      setServerError(
        "Unable to create your account. Please try again."
      );

      toast.error("Registration failed");
    }
  };

  return (
    <div className="rounded-xl border border-[#DCDCDC]/40 bg-[#050505] px-6 py-8 sm:px-8 sm:py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-[#DCDCDC]"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            {...registerField("name")}
            className="h-11 w-full rounded-md border border-[#292929] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none transition-colors placeholder:text-[#555] focus:border-[#DCDCDC]/60"
          />

          {errors.name && (
            <p className="text-sm text-[#A3A3A3]">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[#DCDCDC]"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...registerField("email")}
            className="h-11 w-full rounded-md border border-[#292929] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none transition-colors placeholder:text-[#555] focus:border-[#DCDCDC]/60"
          />

          {errors.email && (
            <p className="text-sm text-[#A3A3A3]">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[#DCDCDC]"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            {...registerField("password")}
            className="h-11 w-full rounded-md border border-[#292929] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none transition-colors placeholder:text-[#555] focus:border-[#DCDCDC]/60"
          />

          {errors.password && (
            <p className="text-sm text-[#A3A3A3]">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div
            role="alert"
            className="rounded-md border border-[#292929] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#A3A3A3]"
          >
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-md bg-[#F5F5F5] px-4 text-sm font-medium text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Creating account..."
            : "Create account"}
        </button>
      </form>

      {/* Login */}
      <div className="mt-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#292929]" />

        <span className="text-xs text-[#737373]">
          Already have an account?
        </span>

        <div className="h-px flex-1 bg-[#292929]" />
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/login"
          className="text-sm text-[#DCDCDC] underline underline-offset-4 transition-colors hover:text-white"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}