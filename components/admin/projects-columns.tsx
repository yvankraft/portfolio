"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Archive, Eye, MoreHorizontal, Star, Trash2 } from "lucide-react";
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
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/generated/prisma/client";

type Handlers = {
  onEdit: (id: string) => void;
  onToggleStatus: (project: Project) => void;
  onDelete: (id: string) => void;
};

export function getProjectColumns({
  onEdit,
  onToggleStatus,
  onDelete,
}: Handlers): ColumnDef<Project>[] {
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
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">/{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) =>
        row.original.status === "PUBLISHED" ? (
          <Badge>Publié</Badge>
        ) : (
          <Badge variant="secondary">Brouillon</Badge>
        ),
    },
    {
      accessorKey: "featured",
      header: "Avant",
      cell: ({ row }) =>
        row.original.featured ? (
          <Star className="size-4 fill-primary text-primary" />
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "updatedAt",
      header: "Modifié",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.original.updatedAt)}
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
            <DropdownMenuItem onClick={() => onEdit(row.original.id)}>
              <Eye className="size-4" /> Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(row.original)}>
              <Archive className="size-4" />
              {row.original.status === "PUBLISHED" ? "Dépublier" : "Publier"}
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
