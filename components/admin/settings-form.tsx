"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword, updateProfile } from "@/app/actions/settings";
import {
  passwordSchema,
  profileSchema,
  type PasswordInput,
  type ProfileInput,
} from "@/lib/validators/auth";

export function SettingsForm({
  defaultValues,
}: {
  defaultValues: ProfileInput;
}) {
  const profile = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });
  const password = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onProfile(data: ProfileInput) {
    const res = await updateProfile(data);
    if (res.ok) toast.success("Profil mis à jour");
    else toast.error(res.error);
  }

  async function onPassword(data: PasswordInput) {
    const res = await updatePassword(data);
    if (res.ok) {
      toast.success("Mot de passe mis à jour");
      password.reset();
    } else toast.error(res.error);
  }

  const profileErrors = profile.formState.errors;
  const passwordErrors = password.formState.errors;

  return (
    <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Nom et email de l&apos;administrateur.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profile.handleSubmit(onProfile)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" {...profile.register("name")} />
              {profileErrors.name && (
                <p className="text-xs text-destructive">
                  {profileErrors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...profile.register("email")} />
              {profileErrors.email && (
                <p className="text-xs text-destructive">
                  {profileErrors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={profile.formState.isSubmitting}>
              {profile.formState.isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mot de passe</CardTitle>
          <CardDescription>Changer le mot de passe admin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={password.handleSubmit(onPassword)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...password.register("currentPassword")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...password.register("newPassword")}
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-destructive">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmation</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...password.register("confirmPassword")}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={password.formState.isSubmitting}>
              {password.formState.isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Changer le mot de passe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
