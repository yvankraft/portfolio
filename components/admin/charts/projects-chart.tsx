"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: { status: string; count: number }[];
};

const COLORS: Record<string, string> = {
  PUBLISHED: "#c98a4b",
  DRAFT: "#a8a29e",
};
const LABELS: Record<string, string> = {
  PUBLISHED: "Publiés",
  DRAFT: "Brouillons",
};

export function ProjectsChart({ data }: Props) {
  const chartData = data.map((d) => ({ ...d, label: LABELS[d.status] ?? d.status }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Projets par statut
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
              width={24}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" name="Projets" radius={[6, 6, 0, 0]}>
              {chartData.map((d) => (
                <Cell key={d.status} fill={COLORS[d.status] ?? "#a8a29e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
