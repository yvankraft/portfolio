import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="font-serif text-7xl text-primary">404</p>
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="max-w-md text-muted-foreground">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/" className={buttonVariants()}>
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
