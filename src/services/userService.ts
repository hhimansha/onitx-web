import api from "./api";
import type { User, UserWithStats, UpdateProfilePayload } from "@/types";

const unwrap = <T>(raw: unknown): T => {
  if (raw !== null && typeof raw === "object" && !Array.isArray(raw) && "success" in raw) {
    return (raw as { success: boolean; data: T }).data;
  }
  return raw as T;
};

export const getUsers = () =>
  api.get<unknown>("/api/users").then((res) => unwrap<User[]>(res.data));

export const getAdminUsers = () =>
  api.get<unknown>("/api/users").then((res) => unwrap<UserWithStats[]>(res.data));

export interface UserOption {
  id: string;
  name: string;
}

export const getUserOptions = () =>
  api.get<unknown>("/api/users/options").then((res) => unwrap<UserOption[]>(res.data));

export const getMe = () =>
  api.get<unknown>("/api/users/me").then((res) => unwrap<User>(res.data));

export const updateMe = (data: UpdateProfilePayload) =>
  api.put<unknown>("/api/users/me", data).then((res) => unwrap<User>(res.data));
