import api from "./api";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types";

// Backends commonly wrap success responses as either:
//   { token, user, ... }            (flat)
//   { success: true, data: { token, user } }  (nested)
// This helper normalises both shapes.
interface RawAuthResponse {
  token?: string;
  user?: User;
  data?: { token: string; user: User };
}

const extract = (raw: RawAuthResponse): AuthResponse => {
  const token = raw.token ?? raw.data?.token;
  const user = raw.user ?? raw.data?.user;
  if (!token || !user) {
    throw new Error("Unexpected response from server — token or user missing.");
  }
  return { token, user };
};

export const login = (credentials: LoginCredentials) =>
  api.post<RawAuthResponse>("/api/auth/login", credentials).then((res) => extract(res.data));

export const register = (credentials: RegisterCredentials) =>
  api.post<RawAuthResponse>("/api/auth/register", credentials).then((res) => extract(res.data));
