import api from "./api";
import type { User } from "@/types";

export const getUsers = () =>
  api.get<User[]>("/api/users").then((res) => res.data);
