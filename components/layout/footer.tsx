import Link from "next/link";
import { Mail } from "lucide-react";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
        </p>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`mailto:${SITE.email}`}
            aria-label="Email"
            className="hover:text-foreground"
          >
            <Mail className="size-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
