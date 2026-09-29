"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { buttonVariants, Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getProjectColumns } from "@/components/admin/projects-columns";
import { deleteProjects, setProjectsStatus } from "@/app/actions/projects";
import type { Project } from "@/lib/generated/prisma/client";

type Result = { ok: true } | { ok: false; error: string };

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [toDelete, setToDelete] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function run(action: Promise<Result>, success: string) {
    const res = await action;
    if (res.ok) {
      toast.success(success);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  const columns = getProjectColumns({
    onEdit: (id) => router.push(`/admin/projects/${id}`),
    onToggleStatus: (p) =>
      run(
        setProjectsStatus(
          [p.id],
          p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
        ),
        "Statut mis à jour",
      ),
    onDelete: (id) => {
      setToDelete([id]);
      setConfirmOpen(true);
    },
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={projects}
        searchKey="title"
        searchPlaceholder="Rechercher un projet…"
        renderBulkActions={(rows, reset) => {
          const ids = rows.map((r) => r.id);
          const bulk = (action: Promise<Result>, msg: string) =>
            run(
              action.then((r) => (reset(), r)),
              msg,
            );
          return (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  bulk(setProjectsStatus(ids, "PUBLISHED"), "Projets publiés")
                }
              >
                Publier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  bulk(setProjectsStatus(ids, "DRAFT"), "Projets dépubliés")
                }
              >
                Dépublier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setToDelete(ids);
                  setConfirmOpen(true);
                }}
              >
                Supprimer
              </Button>
            </>
          );
        }}
      />
      {projects.length === 0 && (
        <div className="mt-4">
          <Link href="/admin/projects/new" className={buttonVariants()}>
            Créer un projet
          </Link>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer définitivement ?"
        description={`${toDelete.length} projet(s) seront supprimés. Cette action est irréversible.`}
        onConfirm={() => run(deleteProjects(toDelete), "Projet(s) supprimé(s)")}
      />
    </>
  );
}
