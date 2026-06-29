import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";

import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import { Sun, Moon } from "lucide-react";

const loginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const { theme, toggle } = useTheme();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      await login(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(
          (err.response?.data as { message?: string })?.message ??
            "Login failed. Please try again."
        );
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Blurred dashboard screenshot background */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{
          backgroundImage: `url('/${theme === "dark" ? "dark-dash" : "light-dash"}.png')`,
          filter: "blur(7px)",
        }}
      />

      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0",
          theme === "dark" ? "bg-black/65" : "bg-white/55"
        )}
      />

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-card/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      {/* Form card */}
      <div className="relative z-10 mx-4 w-full max-w-sm">
        <div className="space-y-6 rounded-2xl border border-border/40 bg-card/90 p-8 shadow-2xl backdrop-blur-md">
          {/* Logo + heading */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <img
              src={theme === "dark" ? "/onitx-white1.png" : "/onitx-black1.png"}
              alt="OnitX"
              className="mb-1 h-6 w-auto"
            />
            <h1 className="text-xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue to your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {apiError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {apiError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign up free
            </Link>
          </p>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/" className="underline-offset-4 hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
