import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import { getMe, updateMe } from "@/services/userService";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  designation: z.string().optional(),
  profileImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    getMe()
      .then((user) => {
        setProfile(user);
        reset({
          name: user.name,
          email: user.email,
          designation: user.designation ?? "",
          profileImage: user.profileImage ?? "",
        });
      })
      .catch(() => setApiError("Failed to load profile."))
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    setSuccess(false);
    try {
      const updated = await updateMe({
        name: data.name,
        email: data.email,
        designation: data.designation || undefined,
        profileImage: data.profileImage || undefined,
      });
      setProfile(updated);
      reset({
        name: updated.name,
        email: updated.email,
        designation: updated.designation ?? "",
        profileImage: updated.profileImage ?? "",
      });
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(
          (err.response?.data as { message?: string })?.message ??
            "Failed to update profile."
        );
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account information</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Avatar preview */}
          {profile?.profileImage && (
            <div className="mb-6 flex justify-center">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="h-20 w-20 rounded-full object-cover border"
              />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" placeholder="e.g. Software Engineer" {...register("designation")} />
              {errors.designation && (
                <p className="text-xs text-destructive">{errors.designation.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="profileImage">Profile image URL</Label>
              <Input
                id="profileImage"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                {...register("profileImage")}
              />
              <p className="text-xs text-muted-foreground">
                Upload your image to a CDN first, then paste the URL here.
              </p>
              {errors.profileImage && (
                <p className="text-xs text-destructive">{errors.profileImage.message}</p>
              )}
            </div>

            {apiError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {apiError}
              </p>
            )}

            {success && (
              <p className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700">
                Profile updated successfully.
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
