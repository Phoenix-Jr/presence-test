"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Lightbulb, Star, Users, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AIInsight } from "@/types";
import { cn } from "@/lib/utils/cn";

const ICON_MAP: Record<string, React.ElementType> = {
  AlertTriangle, TrendingUp, Lightbulb, Star, Users,
};

const TYPE_STYLES = {
  warning: { badge: "warning" as const, dot: "bg-amber-500", border: "border-l-amber-500" },
  positive: { badge: "success" as const, dot: "bg-emerald-500", border: "border-l-emerald-500" },
  suggestion: { badge: "info" as const, dot: "bg-blue-500", border: "border-l-blue-500" },
};

interface Props {
  insights: AIInsight[];
  isLoading?: boolean;
}

export function InsightsPanel({ insights, isLoading }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, i) => {
          const Icon = ICON_MAP[insight.icon] ?? Lightbulb;
          const styles = TYPE_STYLES[insight.type];
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "border-l-2 pl-3 py-2 rounded-r-lg bg-accent/30",
                styles.border
              )}
            >
              <div className="flex items-start gap-2 justify-between">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold leading-tight">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{insight.description}</p>
                    {insight.metric && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {insight.metric}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={styles.badge} className="flex-shrink-0 capitalize text-[10px]">
                  {insight.type}
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
