"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ArrowDownCircle, ArrowUpCircle, Zap, UserCheck, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAttendance } from "@/lib/hooks/useAttendance";
import { formatRelative } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const AGE_FR: Record<string, string> = { child: "Enfant", youth: "Jeune", adult: "Adulte", senior: "Senior" };
const GENDER_FR: Record<string, string> = { male: "Homme", female: "Femme" };

export function AIDetectionFeed() {
  const { detectionEvents, aiRunning, currentSession } = useAttendance();

  const knownCount   = detectionEvents.filter((e) => e.isKnown && e.action === "enter").length;
  const unknownCount = detectionEvents.filter((e) => !e.isKnown && e.action === "enter").length;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Cpu className={cn("w-4 h-4", aiRunning ? "text-primary animate-pulse" : "text-muted-foreground")} />
          Flux de détection IA
          {aiRunning && (
            <span className="flex items-center gap-1 text-xs font-normal text-emerald-500 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />En direct
            </span>
          )}
        </CardTitle>
        {detectionEvents.length > 0 && (
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1 text-indigo-500"><UserCheck className="w-3 h-3" /><strong>{knownCount}</strong> membres</span>
            <span className="flex items-center gap-1 text-slate-400"><Eye className="w-3 h-3" /><strong>{unknownCount}</strong> inconnus</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {!currentSession ? (
          <p className="text-xs text-muted-foreground text-center py-8">Démarrez une session pour voir les détections.</p>
        ) : detectionEvents.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            {aiRunning ? "En attente de détections…" : "Activez la détection IA pour voir les événements."}
          </p>
        ) : (
          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-0.5">
            <AnimatePresence>
              {detectionEvents.slice(0, 25).map((ev) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: 16, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    "flex items-center gap-2.5 p-2 rounded-lg border text-xs",
                    ev.action === "enter"
                      ? ev.isKnown
                        ? "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20"
                        : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30"
                      : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                  )}
                >
                  {ev.action === "enter"
                    ? <ArrowDownCircle className={cn("w-3.5 h-3.5 flex-shrink-0", ev.isKnown ? "text-indigo-500" : "text-slate-400")} />
                    : <ArrowUpCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    {ev.isKnown && ev.memberName ? (
                      <span className="font-semibold text-indigo-700 dark:text-indigo-300 truncate block">{ev.memberName}</span>
                    ) : (
                      <span className="font-medium text-slate-500 capitalize">
                        {GENDER_FR[ev.gender]} · {AGE_FR[ev.ageGroup]}
                        <Badge variant="outline" className="ml-1.5 text-[9px] px-1 py-0">inconnu</Badge>
                      </span>
                    )}
                    <span className="text-muted-foreground text-[10px] capitalize">{ev.action === "enter" ? "Entrée" : "Sortie"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground flex-shrink-0">
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[10px]">{Math.round(ev.confidence * 100)}%</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
