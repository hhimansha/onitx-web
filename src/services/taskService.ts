import api from "./api";
import type { Task, TaskPayload } from "@/types";

// Backend envelopes every response: { success: true, data: T }
// This helper unwraps the envelope — if the response already has no
// `success` key (i.e. it IS the data) it is returned as-is.
const unwrap = <T>(raw: unknown): T => {
  if (raw !== null && typeof raw === "object" && !Array.isArray(raw) && "success" in raw) {
    return (raw as { success: boolean; data: T }).data;
  }
  return raw as T;
};

export const getTasks = () =>
  api.get<unknown>("/api/tasks").then((res) => unwrap<Task[]>(res.data));

export const getTask = (id: string) =>
  api.get<unknown>(`/api/tasks/${id}`).then((res) => unwrap<Task>(res.data));

export const createTask = (data: TaskPayload) =>
  api.post<unknown>("/api/tasks", data).then((res) => unwrap<Task>(res.data));

export const updateTask = (id: string, data: Partial<TaskPayload>) =>
  api.put<unknown>(`/api/tasks/${id}`, data).then((res) => unwrap<Task>(res.data));

export const deleteTask = (id: string) =>
  api.delete(`/api/tasks/${id}`);
