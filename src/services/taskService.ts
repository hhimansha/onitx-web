import api from "./api";
import type { Task } from "@/types";

export const getTasks = () =>
  api.get<Task[]>("/api/tasks").then((res) => res.data);
