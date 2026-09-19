"use client";

import { toast } from "sonner";

import { revokeShare } from "../api";
import type { Share } from "../types";

type ShareListProps = {
  shares: Share[];
  onRevoked: (shareId: string) => void;
};

export default function ShareList({
  shares,
  onRevoked,
}: ShareListProps) {
  const handleRevoke = async (shareId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this share?"
    );

    if (!confirmed) return;

    try {
      await revokeShare(shareId);

      toast.success("Share revoked");

      onRevoked(shareId);
    } catch (error) {
      console.error("Failed to revoke share:", error);
      toast.error("Unable to revoke share");
    }
  };

  if (shares.length === 0) {
    return (
      <div className="rounded-xl border border-[#292929] bg-[#080808] px-6 py-10 text-center">
        <p className="text-sm text-[#737373]">
          No shares created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {shares.map((share) => {
        const isRevoked = share.revokedAt !== null;
        const isExpired = new Date(share.expiresAt) <= new Date();

        return (
          <div
            key={share.id}
            className="rounded-xl border border-[#292929] bg-[#080808] p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-[#F5F5F5]">
                    {share.shareType === "one_time"
                      ? "One-time"
                      : "Time-based"}
                  </span>

                  <span className="text-[#525252]">·</span>

                  <span className="text-sm text-[#A3A3A3]">
                    {share.accessType === "public"
                      ? "Public"
                      : "Password protected"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#737373]">
                  <span>
                    Views: {share.viewCount}
                  </span>

                  <span>
                    Expires:{" "}
                    {new Date(share.expiresAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs ${
                    isRevoked || isExpired
                      ? "text-[#737373]"
                      : "text-[#A3A3A3]"
                  }`}
                >
                  {isRevoked
                    ? "Revoked"
                    : isExpired
                      ? "Expired"
                      : "Active"}
                </span>

                {!isRevoked && !isExpired && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(share.id)}
                    className="rounded-md border border-[#292929] px-3 py-2 text-xs text-[#A3A3A3] transition-colors hover:border-[#525252] hover:bg-[#0A0A0A] hover:text-[#F5F5F5]"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}