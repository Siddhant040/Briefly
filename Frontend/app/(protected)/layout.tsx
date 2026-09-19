import { AuthProvider } from "@/features/auth/context/AuthContext";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </AuthProvider>
  );
}