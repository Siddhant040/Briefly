import RegisterForm from "@/features/auth/components/RegisterForm";
import Logo from "@/components/common/logo";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 py-12 text-[#F5F5F5]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-[#8A8A8A]">
            Start sharing notes securely.
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}