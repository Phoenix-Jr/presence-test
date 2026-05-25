"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/sparkline";
import type { SparklinePoint } from "@/types";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  sparkline?: SparklinePoint[];
  sparklineColor?: string;
  index?: number;
  compact?: boolean;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  sparkline,
  sparklineColor,
  index = 0,
  compact = false,
}: KPICardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
    >
      <Card className={cn("hover:shadow-md transition-shadow duration-200 overflow-hidden", compact ? "p-4" : "p-5")}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium truncate">{title}</p>
            <motion.p
              key={String(value)}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("font-bold tracking-tight tabular-nums", compact ? "text-2xl mt-0.5" : "text-3xl mt-1")}
            >
              {value}
            </motion.p>
          </div>
          <div className={cn("rounded-lg flex-shrink-0", iconBg, compact ? "p-2" : "p-2.5")}>
            <Icon className={cn("flex-shrink-0", iconColor, compact ? "w-4 h-4" : "w-5 h-5")} />
          </div>
        </div>

        {sparkline && sparkline.length > 0 && (
          <div className="mt-2 -mx-1">
            <Sparkline data={sparkline} color={sparklineColor ?? "#6366f1"} height={28} />
          </div>
        )}

        {(trend !== undefined || subtitle || trendLabel) && (
          <div className="mt-2 flex items-center gap-1.5">
            {trend !== undefined && (
              <span className={cn(
                "flex items-center gap-0.5 text-xs font-semibold",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? "+" : ""}{trend.toFixed(1)}%
              </span>
            )}
            {(trendLabel || subtitle) && (
              <span className="text-xs text-muted-foreground truncate">{trendLabel ?? subtitle}</span>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
