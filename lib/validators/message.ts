import { z } from "zod";

export const replySchema = z.object({
  reply: z.string().min(2, "Réponse trop courte").max(10000),
});

export const messageStatusSchema = z.enum(["NEW", "READ", "ARCHIVED"]);

export type ReplyInput = z.infer<typeof replySchema>;
export type MessageStatusInput = z.infer<typeof messageStatusSchema>;
