import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { MessagesTable } from "@/components/admin/messages-table";
import { EmptyState } from "@/components/admin/empty-state";
import { getAllMessages } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await getAllMessages();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          {messages.filter((m) => m.status === "NEW").length} non lu(s) sur{" "}
          {messages.length}.
        </p>
      </div>
      {messages.length ? (
        <MessagesTable messages={messages} />
      ) : (
        <EmptyState
          icon={Inbox}
          title="Aucun message"
          description="Les messages envoyés via le formulaire de contact apparaîtront ici."
        />
      )}
    </div>
  );
}
