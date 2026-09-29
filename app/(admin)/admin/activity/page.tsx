import type { Metadata } from "next";
import { History } from "lucide-react";
import { ActivityTable } from "@/components/admin/activity-table";
import { EmptyState } from "@/components/admin/empty-state";
import { getActivityLogs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Activité" };

export default async function AdminActivityPage() {
  const logs = await getActivityLogs(100);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Activité</h1>
        <p className="text-sm text-muted-foreground">
          Journal des actions récentes dans l&apos;admin.
        </p>
      </div>
      {logs.length ? (
        <ActivityTable logs={logs} />
      ) : (
        <EmptyState
          icon={History}
          title="Aucune activité"
          description="Les actions effectuées dans l'admin seront journalisées ici."
        />
      )}
    </div>
  );
}
