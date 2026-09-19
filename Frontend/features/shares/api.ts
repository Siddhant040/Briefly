import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  CreateShareRequest,
  CreateShareResponse,
  Share,
  ShareAccessResponse,
} from "./types";

export async function createShare(
  noteId: string,
  data: CreateShareRequest,
): Promise<CreateShareResponse> {
  const response = await apiClient.post<
    ApiResponse<CreateShareResponse>
  >(`/notes/${noteId}/shares`, data);

  return response.data.data;
}
export async function getSharedNote(
  token: string
): Promise<ShareAccessResponse> {
  const response = await apiClient.get<ApiResponse<ShareAccessResponse>>(
    `/share/${token}`
  );

  return response.data.data;
}

export async function accessProtectedShare(
  token: string,
  accessKey: string
): Promise<ShareAccessResponse> {
  const response = await apiClient.post<ApiResponse<ShareAccessResponse>>(
    `/share/${token}/access`,
    { accessKey }
  );

  return response.data.data;
}



export async function getSharesByNoteId(
  noteId: string
): Promise<Share[]> {
  const response = await apiClient.get<ApiResponse<Share[]>>(
    `/notes/${noteId}/shares`
  );

  return response.data.data;
}

export async function revokeShare(shareId: string): Promise<void> {
  await apiClient.post<ApiResponse<void>>(
    `/share/${shareId}/revoke`
  );
}