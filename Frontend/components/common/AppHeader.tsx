"use client";

import { CircleUserRound, LogOut, NotebookPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AppHeader() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();

            toast.success("Logged out successfully");
            router.replace("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Unable to log out");
        }
    };

    return (
        <header className="border-b border-[#1A1A1A]">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <NotebookPen
                        size={20}
                        strokeWidth={1.8}
                    />

                    <span className="text-lg font-medium tracking-tight">
                        Briefly
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#292929] text-[#A3A3A3]">
                            <CircleUserRound size={17} strokeWidth={1.8} />
                        </div>

                        <span className="hidden text-sm text-[#A3A3A3] sm:block">
                            {user?.name}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#A3A3A3] transition-colors hover:bg-[#0A0A0A] hover:text-[#F5F5F5]"
                    >
                        <LogOut size={16} strokeWidth={1.8} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}