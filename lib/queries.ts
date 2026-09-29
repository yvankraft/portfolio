import { db } from "@/lib/db";
import { MessageStatus, ProjectStatus } from "@/lib/generated/prisma/enums";

export function getPublishedProjects() {
  return db.project.findMany({
    where: { status: ProjectStatus.PUBLISHED },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

export function getFeaturedProjects(take = 3) {
  return db.project.findMany({
    where: { status: ProjectStatus.PUBLISHED, featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take,
  });
}

export function getProjectBySlug(slug: string) {
  return db.project.findUnique({ where: { slug } });
}

export async function getSiteContent(key: string) {
  const row = await db.siteContent.findUnique({ where: { key } });
  return row?.content ?? null;
}

export function getAllProjects() {
  return db.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export function getAllMessages() {
  return db.message.findMany({ orderBy: { createdAt: "desc" } });
}

export function getMessage(id: string) {
  return db.message.findUnique({ where: { id } });
}

export function getActivityLogs(take = 50) {
  return db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getDashboardStats() {
  const [
    projectCount,
    publishedCount,
    newMessages,
    totalMessages,
    recentMessages,
    projectsByStatus,
  ] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { status: ProjectStatus.PUBLISHED } }),
    db.message.count({ where: { status: MessageStatus.NEW } }),
    db.message.count(),
    db.message.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 86400_000) } },
      select: { createdAt: true },
    }),
    db.project.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const messagesPerDay = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400_000)
      .toISOString()
      .slice(0, 10);
    messagesPerDay.set(day, 0);
  }
  for (const m of recentMessages) {
    const day = m.createdAt.toISOString().slice(0, 10);
    if (messagesPerDay.has(day)) {
      messagesPerDay.set(day, (messagesPerDay.get(day) ?? 0) + 1);
    }
  }

  return {
    projectCount,
    publishedCount,
    newMessages,
    totalMessages,
    messagesChart: [...messagesPerDay.entries()].map(([date, count]) => ({
      date,
      count,
    })),
    projectsChart: projectsByStatus.map((row) => ({
      status: row.status,
      count: row._count.status,
    })),
  };
}

export function getExperiences() {
  return db.experience.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}
