"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { formatDateTime } from "@/lib/format";
import type { ActivityLog } from "@/lib/generated/prisma/client";

const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <Badge variant="secondary">{row.original.action}</Badge>,
  },
  {
    accessorKey: "entity",
    header: "Entité",
    cell: ({ row }) => row.original.entity,
  },
  {
    accessorKey: "detail",
    header: "Détail",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.detail ?? "—"}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
];

export function ActivityTable({ logs }: { logs: ActivityLog[] }) {
  return (
    <DataTable
      columns={columns}
      data={logs}
      searchKey="entity"
      searchPlaceholder="Filtrer par entité…"
    />
  );
}
