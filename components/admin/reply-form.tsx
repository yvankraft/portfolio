"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { replyToMessage } from "@/app/actions/messages";
import { replySchema, type ReplyInput } from "@/lib/validators/message";

export function ReplyForm({ messageId }: { messageId: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReplyInput>({
    resolver: zodResolver(replySchema),
    defaultValues: { reply: "" },
  });

  async function onSubmit(data: ReplyInput) {
    const res = await replyToMessage(messageId, data);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    reset();
    toast.success("Réponse envoyée");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Label htmlFor="reply">Répondre par email</Label>
      <Textarea
        id="reply"
        rows={5}
        placeholder="Votre réponse…"
        {...register("reply")}
      />
      {errors.reply && (
        <p className="text-xs text-destructive">{errors.reply.message}</p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        Envoyer la réponse
      </Button>
    </form>
  );
}
