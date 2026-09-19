export type ShareType = "one_time" | "time_based";

export type AccessType = "public" | "password";

export type CreateShareRequest = {
  shareType: ShareType;
  accessType: AccessType;
  expiresAt: string;
};

export type CreateShareResponse = {
  id: string;
  shareType: ShareType;
  accessType: AccessType;
  expiresAt: string;
  shareToken: string;
  accessKey?: string;
};

export type SharedNote = {
  title: string;
  content: string;
};

export type ShareAccessResponse = {
  note: SharedNote;
};

export type Share = {
  id: string;
  shareType: "one_time" | "time_based";
  accessType: "public" | "password";
  viewCount: number;
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
};