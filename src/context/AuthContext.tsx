import { createContext, useState, type ReactNode } from "react";
import * as authService from "@/services/authService";
import type { LoginCredentials, RegisterCredentials, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const persist = (token: string, user: User) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(getStoredUser);

  const applyAuth = (token: string, user: User) => {
    persist(token, user);
    setToken(token);
    setUser(user);
  };

  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    applyAuth(data.token, data.user);
  };

  const register = async (credentials: RegisterCredentials) => {
    const data = await authService.register(credentials);
    if (data) applyAuth(data.token, data.user);
    // if data is null, registration succeeded but no token — caller handles redirect
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: Boolean(token), login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
