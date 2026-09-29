import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Discutons de votre projet.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-4xl italic md:text-5xl">Contact</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Une question, un projet, une opportunité ? Écrivez-moi.
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
        <FadeIn>
          <ContactForm />
        </FadeIn>
        <FadeIn delay={0.1} className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <a
                href="mailto:hello@example.com"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                hello@example.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Localisation</p>
              <p className="text-sm text-muted-foreground">
                Paris, France — remote friendly
              </p>
            </div>
          </div>
          <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
            Temps de réponse habituel : moins de 48&nbsp;h.
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
