"use client";

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { AttendanceTrend } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  data: AttendanceTrend[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-popover shadow-xl p-2.5 text-xs space-y-1">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold">{p.value}{p.name === "taux" ? "%" : ""}</span>
        </div>
      ))}
    </div>
  );
};

export function VisitorTrendChart({ data, isLoading }: Props) {
  if (isLoading) return (
    <Card><CardHeader><Skeleton className="h-4 w-48" /></CardHeader><CardContent><Skeleton className="h-56 w-full" /></CardContent></Card>
  );
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Membres vs Visiteurs — tendance</CardTitle>
        <CardDescription className="text-xs">Évolution comparative sur 12 sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 2 }} barSize={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left"  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span style={{ fontSize: 11, textTransform: "capitalize" }}>{v}</span>} />
            <Bar yAxisId="left" dataKey="present"  name="membres"   fill="#6366f1" radius={[3,3,0,0]} />
            <Bar yAxisId="left" dataKey="visitors" name="visiteurs" fill="#94a3b8" radius={[3,3,0,0]} />
            <Line yAxisId="right" type="monotone" dataKey="rate" name="taux" stroke="#10b981" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
