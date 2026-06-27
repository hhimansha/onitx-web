import api from "./api";
import type { Task, TaskPayload } from "@/types";

export const getTasks = () =>
  api.get<Task[]>("/api/tasks").then((res) => res.data);

export const getTask = (id: string) =>
  api.get<Task>(`/api/tasks/${id}`).then((res) => res.data);

export const createTask = (data: TaskPayload) =>
  api.post<Task>("/api/tasks", data).then((res) => res.data);

export const updateTask = (id: string, data: Partial<TaskPayload>) =>
  api.put<Task>(`/api/tasks/${id}`, data).then((res) => res.data);

export const deleteTask = (id: string) =>
  api.delete(`/api/tasks/${id}`);
