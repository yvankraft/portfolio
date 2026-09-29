"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { deleteExperience } from "@/app/actions/experiences";
import { ExperienceDialog, type ExperienceRow } from "@/components/admin/experience-dialog";

function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4 text-destructive" />
        )}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Supprimer cette expérience ?"
        description="Elle disparaîtra de la page À propos."
        onConfirm={() =>
          startTransition(async () => {
            const res = await deleteExperience(id);
            setOpen(false);
            if (!res.ok) toast.error(res.error);
            else {
              toast.success("Expérience supprimée");
              router.refresh();
            }
          })
        }
      />
    </>
  );
}

const columns: ColumnDef<ExperienceRow>[] = [
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.role}</p>
        <p className="text-xs text-muted-foreground">{row.original.company}</p>
      </div>
    ),
  },
  { accessorKey: "period", header: "Période" },
  {
    accessorKey: "summary",
    header: "Résumé",
    cell: ({ row }) =>
      row.original.summary ? (
        <span className="line-clamp-1 max-w-xs text-muted-foreground">
          {row.original.summary}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  { accessorKey: "order", header: "Ordre" },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <ExperienceDialog experience={row.original} />
        <DeleteButton id={row.original.id} />
      </div>
    ),
  },
];

export function ExperiencesTable({ data }: { data: ExperienceRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="role"
      searchPlaceholder="Rechercher une expérience…"
    />
  );
}
