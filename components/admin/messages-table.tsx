"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getMessageColumns } from "@/components/admin/messages-columns";
import { deleteMessages, setMessageStatus } from "@/app/actions/messages";
import type { Message } from "@/lib/generated/prisma/client";

type Result = { ok: true } | { ok: false; error: string };

export function MessagesTable({ messages }: { messages: Message[] }) {
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

  const columns = getMessageColumns({
    onView: (id) => router.push(`/admin/messages/${id}`),
    onSetStatus: (id, status) =>
      run(
        setMessageStatus(id, status),
        status === "READ" ? "Marqué comme lu" : "Message archivé",
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
        data={messages}
        searchKey="name"
        searchPlaceholder="Rechercher un expéditeur…"
        renderBulkActions={(rows, reset) => {
          const bulkStatus = async (status: "READ" | "ARCHIVED") => {
            for (const r of rows) await setMessageStatus(r.id, status);
            return { ok: true as const };
          };
          const wrap = (action: Promise<Result>, msg: string) =>
            run(
              action.then((r) => (reset(), r)),
              msg,
            );
          return (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => wrap(bulkStatus("READ"), "Messages marqués lus")}
              >
                Marquer lus
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  wrap(bulkStatus("ARCHIVED"), "Messages archivés")
                }
              >
                Archiver
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setToDelete(rows.map((r) => r.id));
                  setConfirmOpen(true);
                }}
              >
                Supprimer
              </Button>
            </>
          );
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer définitivement ?"
        description={`${toDelete.length} message(s) seront supprimés. Cette action est irréversible.`}
        onConfirm={() => run(deleteMessages(toDelete), "Message(s) supprimé(s)")}
      />
    </>
  );
}
