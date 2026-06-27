import api from "./api";
import type { User } from "@/types";

// Same envelope pattern as taskService: { success, message, data: User[] }
const unwrap = <T>(raw: unknown): T => {
  if (raw !== null && typeof raw === "object" && !Array.isArray(raw) && "success" in raw) {
    return (raw as { success: boolean; data: T }).data;
  }
  return raw as T;
};

export const getUsers = () =>
  api.get<unknown>("/api/users").then((res) => unwrap<User[]>(res.data));
