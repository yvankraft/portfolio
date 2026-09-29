import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Inbox, Mail, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/stat-card";
import { MessagesChart } from "@/components/admin/charts/messages-chart";
import { ProjectsChart } from "@/components/admin/charts/projects-chart";
import { getAllMessages, getDashboardStats } from "@/lib/queries";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function AdminDashboard() {
  const [stats, messages] = await Promise.all([
    getDashboardStats(),
    getAllMessages(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Projets"
          value={stats.projectCount}
          icon={FolderKanban}
          hint={`${stats.publishedCount} publié(s)`}
        />
        <StatCard
          title="Messages non lus"
          value={stats.newMessages}
          icon={Inbox}
        />
        <StatCard
          title="Messages reçus"
          value={stats.totalMessages}
          icon={Mail}
          hint="Depuis le début"
        />
        <StatCard
          title="Réponses envoyées"
          value={messages.filter((m) => m.repliedAt).length}
          icon={Send}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MessagesChart data={stats.messagesChart} />
        <ProjectsChart data={stats.projectsChart} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Derniers messages
          </CardTitle>
          <CardDescription>Les 5 messages les plus récents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.slice(0, 5).map((m) => (
            <Link
              key={m.id}
              href={`/admin/messages/${m.id}`}
              className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {m.name} — {m.subject ?? m.body}
                </p>
                <p className="text-xs text-muted-foreground">
                  {timeAgo(m.createdAt)}
                </p>
              </div>
              {m.status === "NEW" && <Badge>Nouveau</Badge>}
            </Link>
          ))}
          {messages.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucun message pour l&apos;instant.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
