"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { login } from "../api";
import { loginSchema } from "../validation";
import type { LoginRequest } from "../types";

export default function LoginForm(){
  const router = useRouter();
    const [serverError, setServerError] = useState("");

const {
  register: registerField,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<LoginRequest>({
  resolver: zodResolver(loginSchema),
});

const onSubmit = async (data: LoginRequest) => {
  setServerError("");

  try {
    const user = await login(data);

    console.log("Logged in user:", user);

    toast.success("Logged in successfully");
    router.replace("/")
  } catch (error) {
    console.error("Login failed:", error);

    setServerError("Invalid email or password.");
    toast.error("Login failed");
  }
};

return (
  <div className="rounded-xl border border-[#DCDCDC]/40 bg-[#050505] px-6 py-8 sm:px-8 sm:py-10">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
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
          placeholder="Enter your password"
          autoComplete="current-password"
          {...registerField("password")}
          className="h-11 w-full rounded-md border border-[#292929] bg-[#0A0A0A] px-3 text-sm text-[#F5F5F5] outline-none transition-colors placeholder:text-[#555] focus:border-[#DCDCDC]/60"
        />

        {errors.password && (
          <p className="text-sm text-[#A3A3A3]">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-[#292929] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#A3A3A3]"
        >
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-md bg-[#F5F5F5] px-4 text-sm font-medium text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>

    <div className="mt-7 flex items-center gap-3">
      <div className="h-px flex-1 bg-[#292929]" />

      <span className="text-xs text-[#737373]">
        Don&apos;t have an account?
      </span>

      <div className="h-px flex-1 bg-[#292929]" />
    </div>

    <div className="mt-4 text-center">
      <Link
        href="/register"
        className="text-sm text-[#DCDCDC] underline underline-offset-4 transition-colors hover:text-white"
      >
        Create an account
      </Link>
    </div>
  </div>
);
}