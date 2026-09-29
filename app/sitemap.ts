import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const routes: MetadataRoute.Sitemap = ["", "/projects", "/about", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    }),
  );

  try {
    const projects = await db.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    for (const p of projects) {
      routes.push({
        url: `${base}/projects/${p.slug}`,
        lastModified: p.updatedAt,
      });
    }
  } catch {
    // DB indisponible : on renvoie les routes statiques
  }

  return routes;
}
