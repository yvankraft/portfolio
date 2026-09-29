"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: { date: string; count: number }[];
};

export function MessagesChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Messages reçus — 30 derniers jours
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="msg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c98a4b" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#c98a4b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tickFormatter={(d: string) => d.slice(8)}
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
            <Area
              type="monotone"
              dataKey="count"
              name="Messages"
              stroke="#c98a4b"
              fill="url(#msg)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
