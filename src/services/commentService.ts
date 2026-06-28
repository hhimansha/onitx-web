import api from "./api";
import type { Comment } from "@/types";

const unwrap = <T>(raw: unknown): T => {
  if (raw !== null && typeof raw === "object" && !Array.isArray(raw) && "success" in raw) {
    return (raw as { success: boolean; data: T }).data;
  }
  return raw as T;
};

export const getComments = (taskId: string) =>
  api.get<unknown>(`/api/tasks/${taskId}/comments`).then((res) => unwrap<Comment[]>(res.data));

export const addComment = (taskId: string, content: string) =>
  api.post<unknown>(`/api/tasks/${taskId}/comments`, { content }).then((res) => unwrap<Comment>(res.data));

export const updateComment = (taskId: string, commentId: string, content: string) =>
  api.put<unknown>(`/api/tasks/${taskId}/comments/${commentId}`, { content }).then((res) => unwrap<Comment>(res.data));

export const deleteComment = (taskId: string, commentId: string) =>
  api.delete(`/api/tasks/${taskId}/comments/${commentId}`);
