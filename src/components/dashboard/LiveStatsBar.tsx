"use client";

import { motion } from "framer-motion";
import { Wifi, Users, UserCheck, UserX, Eye } from "lucide-react";
import { useAttendanceStore } from "@/lib/store/attendanceStore";
import { cn } from "@/lib/utils/cn";

export function LiveStatsBar() {
  const { currentSession, aiRunning } = useAttendanceStore();

  if (!currentSession) return null;

  const isRunning = currentSession.status === "running";
  const total = currentSession.totalPresent + currentSession.visitorCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 px-4 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs"
    >
      <span className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
        <span className={cn("w-2 h-2 rounded-full", isRunning ? "bg-emerald-500 animate-pulse" : "bg-amber-400")} />
        {isRunning ? "Session en cours" : "Session en pause"}: {currentSession.title}
      </span>
      <span className="flex items-center gap-1 text-foreground"><UserCheck className="w-3.5 h-3.5 text-indigo-500" /><strong>{currentSession.totalPresent}</strong> membres</span>
      <span className="flex items-center gap-1 text-foreground"><Eye className="w-3.5 h-3.5 text-slate-400" /><strong>{currentSession.visitorCount}</strong> visiteurs</span>
      <span className="flex items-center gap-1 text-foreground"><Users className="w-3.5 h-3.5 text-primary" /><strong>{total}</strong> total</span>
      {aiRunning && (
        <span className="flex items-center gap-1 text-primary ml-auto">
          <Wifi className="w-3.5 h-3.5 animate-pulse" />IA active
        </span>
      )}
    </motion.div>
  );
}
