"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { SparklinePoint } from "@/types";

interface SparklineProps {
  data: SparklinePoint[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = "#6366f1", height = 32 }: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
