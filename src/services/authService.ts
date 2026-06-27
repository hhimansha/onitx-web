import api from "./api";
import type { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types";

export const login = (credentials: LoginCredentials) =>
  api.post<AuthResponse>("/auth/login", credentials).then((res) => res.data);

export const register = (credentials: RegisterCredentials) =>
  api.post<AuthResponse>("/auth/register", credentials).then((res) => res.data);
