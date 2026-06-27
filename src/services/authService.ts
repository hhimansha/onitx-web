import api from "./api";
import type { AuthResponse, LoginCredentials } from "@/types";

export const login = (credentials: LoginCredentials) =>
  api.post<AuthResponse>("/auth/login", credentials).then((res) => res.data);
