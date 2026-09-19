import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "./types";

export async function register(
  data: RegisterRequest
): Promise<User> {
  const response = await apiClient.post<ApiResponse<User>>("/auth/register", data);

  return response.data.data;
}

export async function login(
  data: LoginRequest
): Promise<User> {
  const response = await apiClient.post<ApiResponse<User>>("/auth/login", data);

  return response.data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post<ApiResponse<void>>("/auth/logout");
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>("/auth/me");

  return response.data.data;
}