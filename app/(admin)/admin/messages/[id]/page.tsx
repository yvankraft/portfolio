import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReplyForm } from "@/components/admin/reply-form";
import { getMessage } from "@/lib/queries";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Message" };

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await getMessage(id);
  if (!message) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{message.name}</CardTitle>
              <CardDescription>
                {message.email} — {formatDateTime(message.createdAt)}
              </CardDescription>
            </div>
            <Badge
              variant={message.status === "NEW" ? "default" : "secondary"}
            >
              {message.status === "NEW"
                ? "Nouveau"
                : message.status === "READ"
                  ? "Lu"
                  : "Archivé"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {message.subject && (
            <p className="font-medium">{message.subject}</p>
          )}
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.body}
          </p>
          {message.reply && (
            <>
              <Separator />
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Votre réponse
                  {message.repliedAt &&
                    ` — envoyée ${formatDateTime(message.repliedAt)}`}
                </p>
                <p className="whitespace-pre-wrap text-sm">{message.reply}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <ReplyForm messageId={message.id} />
    </div>
  );
}
