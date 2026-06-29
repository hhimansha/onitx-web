import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";

import { getMe, updateMe } from "@/services/userService";
import type { User } from "@/types";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  designation: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const ProfilePage = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

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
        });
      })
      .catch(() => toast.error("Failed to load profile."))
      .finally(() => setIsLoadingProfile(false));
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const updated = await updateMe({
        name: data.name,
        email: data.email,
        designation: data.designation || undefined,
      });
      updateUser(updated);
      setProfile(updated);
      reset({
        name: updated.name,
        email: updated.email,
        designation: updated.designation ?? "",
      });
      toast.success("Profile updated.");
    } catch (err) {
      const msg =
        axios.isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message ??
            "Failed to update profile."
          : "An unexpected error occurred.";
      toast.error(msg);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
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
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Account information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Avatar display */}
          <div className="flex justify-center">
            <Avatar className="h-20 w-20 ring-2 ring-border ring-offset-2 ring-offset-background">
              <AvatarImage src={profile?.profileImage ?? undefined} alt={profile?.name} />
              <AvatarFallback className="text-xl font-semibold">
                {profile ? getInitials(profile.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                placeholder="e.g. Software Engineer"
                {...register("designation")}
              />
              {errors.designation && (
                <p className="text-xs text-destructive">{errors.designation.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
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
