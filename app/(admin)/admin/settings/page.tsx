import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Paramètres" };

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Paramètres</h1>
        <p className="text-sm text-muted-foreground">
          Gérez votre profil administrateur.
        </p>
      </div>
      <SettingsForm
        defaultValues={{ name: admin.name, email: admin.email }}
      />
    </div>
  );
}
