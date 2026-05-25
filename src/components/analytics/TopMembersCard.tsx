"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Flame, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { MemberEngagement } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

const TREND_ICONS = {
  up: { icon: TrendingUp, color: "text-emerald-500" },
  down: { icon: TrendingDown, color: "text-red-500" },
  stable: { icon: Minus, color: "text-muted-foreground" },
};

interface Props {
  members: MemberEngagement[];
  title: string;
  isLoading?: boolean;
  variant?: "top" | "least";
}

export function TopMembersCard({ members, title, isLoading, variant = "top" }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-1.5 w-full" />
              </div>
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {variant === "top" ? <Award className="w-4 h-4 text-amber-500" /> : <Flame className="w-4 h-4 text-red-400" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((m, i) => {
            const { icon: TrendIcon, color } = TREND_ICONS[m.trend];
            return (
              <motion.div
                key={m.memberId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-bold text-muted-foreground w-4 text-right">{i + 1}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    {m.memberName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold truncate">{m.memberName}</p>
                    <TrendIcon className={cn("w-3 h-3 flex-shrink-0", color)} />
                  </div>
                  <Progress
                    value={m.attendanceRate}
                    className={cn("h-1 mt-1", variant === "least" && "[&>div]:bg-red-400")}
                  />
                </div>
                <div className="text-right">
                  <p className={cn("text-xs font-bold", variant === "top" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
                    {m.attendanceRate}%
                  </p>
                  {m.streak > 0 && (
                    <p className="text-[10px] text-muted-foreground">{m.streak}w streak</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
