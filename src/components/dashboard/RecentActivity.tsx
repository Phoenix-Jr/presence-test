"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck, UserPlus, PlayCircle, StopCircle, AlertTriangle,
  Activity, Eye, ArrowRightLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelative } from "@/lib/utils/format";
import type { ActivityItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

const ITEM_ICONS = {
  check_in:    { icon: UserCheck,      color: "text-emerald-500", bg: "bg-emerald-500/10" },
  new_member:  { icon: UserPlus,       color: "text-blue-500",    bg: "bg-blue-500/10" },
  session_start:{ icon: PlayCircle,    color: "text-indigo-500",  bg: "bg-indigo-500/10" },
  session_end: { icon: StopCircle,     color: "text-slate-500",   bg: "bg-slate-500/10" },
  alert:       { icon: AlertTriangle,  color: "text-amber-500",   bg: "bg-amber-500/10" },
  visitor:     { icon: Eye,            color: "text-slate-400",   bg: "bg-slate-400/10" },
  conversion:  { icon: ArrowRightLeft, color: "text-violet-500",  bg: "bg-violet-500/10" },
};

interface Props {
  items: ActivityItem[];
  isLoading?: boolean;
  compact?: boolean;
}

export function RecentActivity({ items, isLoading, compact }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3"><Skeleton className="h-4 w-32" /></CardHeader>
        <CardContent className="space-y-2.5">
          {Array.from({ length: compact ? 4 : 6 }).map((_, i) => (
            <div key={i} className="flex gap-2.5">
              <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="w-3.5 h-3.5 text-primary" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className={cn("space-y-0", compact && "overflow-y-auto max-h-48")}>
          <AnimatePresence>
            {items.map((item, i) => {
              const { icon: Icon, color, bg } = ITEM_ICONS[item.type] ?? ITEM_ICONS.check_in;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5 py-2 border-b border-border/30 last:border-0"
                >
                  <div className={cn("p-1.5 rounded-full flex-shrink-0 mt-0.5", bg)}>
                    <Icon className={cn("w-3 h-3", color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">{item.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatRelative(item.timestamp)}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
