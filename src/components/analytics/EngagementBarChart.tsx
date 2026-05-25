"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { MemberEngagement } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  engagement: MemberEngagement[];
  isLoading?: boolean;
}

function getBarColor(rate: number) {
  if (rate >= 80) return "#10b981";
  if (rate >= 60) return "#f59e0b";
  return "#f43f5e";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-popover shadow-xl p-3 text-xs">
      <p className="font-semibold">{label}</p>
      <p className="text-muted-foreground mt-1">
        Attendance: <span className="font-semibold text-foreground">{payload[0].value}%</span>
      </p>
    </div>
  );
};

export function EngagementBarChart({ engagement, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-44" /></CardHeader>
        <CardContent><Skeleton className="h-[260px] w-full rounded-lg" /></CardContent>
      </Card>
    );
  }

  const sorted = [...engagement].sort((a, b) => b.attendanceRate - a.attendanceRate);
  const data = sorted.map((m) => ({
    name: m.memberName.split(" ")[0],
    rate: m.attendanceRate,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Engagement Overview</CardTitle>
        <CardDescription>Individual attendance rates across all members</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.rate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
