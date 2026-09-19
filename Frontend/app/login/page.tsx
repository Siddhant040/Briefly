import LoginForm from "@/features/auth/components/LoginForm";
import Logo from "@/components/common/logo";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 py-12 text-[#F5F5F5]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-[#8A8A8A]">
            Sign in to continue to Briefly.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}