"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { submitContact } from "@/app/actions/contact";
import { contactSchema, type ContactInput } from "@/lib/validators/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", body: "", website: "" },
  });

  async function onSubmit(data: ContactInput) {
    const res = await submitContact(data);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setDone(true);
    reset();
    toast.success("Message envoyé, merci !");
  }

  if (done) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="font-serif text-2xl italic">Message bien reçu.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Je vous répondrai dans les plus brefs délais.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("website")}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" placeholder="Votre nom" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="vous@exemple.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Sujet (optionnel)</Label>
        <Input id="subject" placeholder="Projet, mission…" {...register("subject")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Message</Label>
        <Textarea
          id="body"
          rows={6}
          placeholder="Décrivez votre besoin…"
          {...register("body")}
        />
        {errors.body && (
          <p className="text-xs text-destructive">{errors.body.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        Envoyer
      </Button>
    </form>
  );
}
