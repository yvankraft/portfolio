"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { Archive, Eye, MailOpen, MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timeAgo } from "@/lib/format";
import type { Message } from "@/lib/generated/prisma/client";

const statusBadge: Record<string, ReactNode> = {
  NEW: <Badge>Nouveau</Badge>,
  READ: <Badge variant="secondary">Lu</Badge>,
  ARCHIVED: <Badge variant="outline">Archivé</Badge>,
};

type Handlers = {
  onView: (id: string) => void;
  onSetStatus: (id: string, status: "READ" | "ARCHIVED") => void;
  onDelete: (id: string) => void;
};

export function getMessageColumns({
  onView,
  onSetStatus,
  onDelete,
}: Handlers): ColumnDef<Message>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={() => table.toggleAllPageRowsSelected()}
          aria-label="Tout sélectionner"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={() => row.toggleSelected()}
          aria-label="Sélectionner"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Expéditeur",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "body",
      header: "Message",
      cell: ({ row }) => (
        <p className="max-w-xs truncate text-muted-foreground">
          {row.original.subject ?? row.original.body}
        </p>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => statusBadge[row.original.status],
    },
    {
      accessorKey: "createdAt",
      header: "Reçu",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {timeAgo(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(row.original.id)}>
              <Eye className="size-4" /> Voir
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSetStatus(row.original.id, "READ")}
            >
              <MailOpen className="size-4" /> Marquer lu
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSetStatus(row.original.id, "ARCHIVED")}
            >
              <Archive className="size-4" /> Archiver
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="size-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
