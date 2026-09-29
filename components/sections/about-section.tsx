import Link from "next/link";
import { Briefcase } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  period: string;
  summary: string | null;
};

export function AboutSection({
  content,
  experiences = [],
}: {
  content: string | null;
  experiences?: ExperienceItem[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-4xl italic md:text-5xl">À propos</h1>
      </FadeIn>
      <FadeIn className="mt-8">
        {content ? (
          <article
            className="prose prose-stone max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-muted-foreground">
            Contenu en cours de rédaction.
          </p>
        )}
      </FadeIn>
      {experiences.length > 0 && (
        <FadeIn className="mt-12 border-t pt-10">
          <h2 className="font-serif text-2xl italic">Parcours</h2>
          <ol className="mt-6 space-y-6">
            {experiences.map((exp) => (
              <li key={exp.id} className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card">
                    <Briefcase className="size-3.5 text-primary" />
                  </span>
                  <span className="mt-2 w-px flex-1 bg-border" />
                </div>
                <div className="pb-2">
                  <p className="font-medium">{exp.role}</p>
                  <p className="text-sm text-muted-foreground">
                    {exp.company} · {exp.period}
                  </p>
                  {exp.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {exp.summary}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </FadeIn>
      )}
      <FadeIn className="mt-12 border-t pt-10">
        <div className="flex flex-col items-start gap-4">
          <h2 className="font-serif text-2xl italic">
            Envie de travailler ensemble ?
          </h2>
          <Link href="/contact" className={buttonVariants()}>
            Me contacter
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
