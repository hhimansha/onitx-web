import api from "./api";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types";

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

export const getMe = () =>
  api.get<RawAuthResponse>("/api/auth/me").then((res) => {
    const raw = res.data as { user?: User; data?: { user: User } };
    return (raw.user ?? raw.data?.user) as User;
  });
