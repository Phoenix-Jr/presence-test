"use client";

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GroupRadarData } from "@/types";

interface Props {
  data: GroupRadarData[];
  isLoading?: boolean;
}

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];
const AXIS_LABELS: Record<string, string> = {
  attendance: "Présence", consistency: "Régularité",
  growth: "Croissance", engagement: "Engagement", retention: "Rétention",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-popover shadow-xl p-2.5 text-xs space-y-1">
      <p className="font-semibold">{AXIS_LABELS[label] ?? label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function GroupRadarChart({ data, isLoading }: Props) {
  if (isLoading) return (
    <Card><CardHeader><Skeleton className="h-4 w-48" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
  );

  // Transform data from array-of-groups to recharts format (array-of-dimensions)
  const dimensions = ["attendance", "consistency", "growth", "engagement", "retention"] as const;
  const chartData = dimensions.map((dim) => ({
    dimension: dim,
    ...Object.fromEntries(data.map((g) => [g.group, g[dim]])),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Radar — Groupes & Ministères</CardTitle>
        <CardDescription className="text-xs">Comparaison multi-dimensionnelle par groupe</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={290}>
          <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="dimension"
              tickFormatter={(v) => AXIS_LABELS[v] ?? v}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
            <Tooltip content={<CustomTooltip />} />
            {data.slice(0, 4).map((g, i) => (
              <Radar
                key={g.group}
                name={g.group}
                dataKey={g.group}
                stroke={COLORS[i]}
                fill={COLORS[i]}
                fillOpacity={0.12}
                strokeWidth={1.5}
              />
            ))}
            <Legend formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
