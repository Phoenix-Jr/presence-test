"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import type { HeatmapCell } from "@/types";
import { format, parseISO, startOfWeek, eachWeekOfInterval, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils/cn";

interface Props {
  data: HeatmapCell[];
  isLoading?: boolean;
}

function getRateColor(rate: number) {
  if (rate === 0) return "bg-muted dark:bg-muted/40";
  if (rate < 40)  return "bg-indigo-100 dark:bg-indigo-900/40";
  if (rate < 60)  return "bg-indigo-300 dark:bg-indigo-700/60";
  if (rate < 80)  return "bg-indigo-500";
  return "bg-indigo-700 dark:bg-indigo-400";
}

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export function AttendanceHeatmap({ data, isLoading }: Props) {
  if (isLoading) return (
    <Card><CardHeader><Skeleton className="h-4 w-44" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
  );

  if (!data.length) return null;

  const start = parseISO(data[0].date);
  const end   = parseISO(data[data.length - 1].date);
  const cellMap = new Map(data.map((c) => [c.date, c]));

  // Build week columns
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Calendrier de présence</CardTitle>
        <CardDescription className="text-xs">Intensité d'assiduité sur les 16 dernières semaines</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={0}>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {/* Day labels */}
              <div className="flex flex-col gap-1 mr-1">
                <div className="h-5" /> {/* month header spacer */}
                {DAY_LABELS.map((d) => (
                  <div key={d} className="h-4 flex items-center text-[9px] text-muted-foreground w-7">{d}</div>
                ))}
              </div>

              {/* Week columns */}
              {weeks.map((weekStart, wi) => {
                const monthLabel = wi === 0 || format(weekStart, "d") <= "7"
                  ? format(weekStart, "MMM", { locale: fr })
                  : "";
                return (
                  <div key={wi} className="flex flex-col gap-1">
                    <div className="h-5 text-[9px] text-muted-foreground flex items-end pb-0.5 w-4">
                      {monthLabel}
                    </div>
                    {Array.from({ length: 7 }).map((_, di) => {
                      const d = addDays(weekStart, di);
                      const iso = format(d, "yyyy-MM-dd");
                      const cell = cellMap.get(iso);
                      if (!cell) return (
                        <div key={di} className="w-4 h-4 rounded-sm bg-transparent" />
                      );
                      return (
                        <Tooltip key={di}>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: wi * 0.01 + di * 0.005 }}
                              className={cn(
                                "w-4 h-4 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary/60 transition-all",
                                getRateColor(cell.rate)
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <p className="font-semibold">{format(d, "d MMMM yyyy", { locale: fr })}</p>
                            <p>{cell.count > 0 ? `${cell.count} présents (${cell.rate}%)` : "Pas de service"}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
            <span>Moins</span>
            {[0, 30, 55, 75, 90].map((r) => (
              <div key={r} className={cn("w-3.5 h-3.5 rounded-sm", getRateColor(r))} />
            ))}
            <span>Plus</span>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
