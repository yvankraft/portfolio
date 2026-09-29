import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";

type Props = {
  title: string;
  subtitle: string;
};

export function Hero({ title, subtitle }: Props) {
  return (
    <section className="py-24 md:py-32">
      <FadeIn>
        <Badge variant="secondary" className="mb-6">
          Disponible pour de nouvelles missions
        </Badge>
        <h1 className="font-serif text-5xl italic md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects" className={buttonVariants()}>
            Voir mes projets <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline" })}
          >
            Me contacter
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
