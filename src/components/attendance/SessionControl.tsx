"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Square, Pause, PlayCircle, Cpu, Plus, Minus, Eye, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAttendance } from "@/lib/hooks/useAttendance";
import { cn } from "@/lib/utils/cn";

export function SessionControl() {
  const {
    currentSession, aiRunning,
    startSession, endSession, pauseSession, resumeSession, toggleAI,
    incrementCount, decrementCount,
  } = useAttendance();

  const [title, setTitle] = useState("Service Dominical");
  const [type, setType] = useState<"service" | "meeting" | "event">("service");

  const handleStart = () => {
    if (!title.trim()) return;
    startSession(title, type);
    toast.success("Session démarrée ! L'IA est prête à détecter.");
  };

  const handleEnd = () => {
    endSession();
    toast.success("Session terminée. Présences enregistrées.");
  };

  const isRunning = currentSession?.status === "running";
  const isPaused  = currentSession?.status === "paused";
  const total     = (currentSession?.totalPresent ?? 0) + (currentSession?.visitorCount ?? 0);
  const memberRate = total > 0 ? Math.round(((currentSession?.totalPresent ?? 0) / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              {currentSession ? (
                <>
                  <span className={cn("w-2.5 h-2.5 rounded-full", isRunning ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                  {isRunning ? "Session active" : "Session en pause"}
                </>
              ) : "Nouvelle session"}
            </span>
            {currentSession && (
              <div className="flex gap-1.5 flex-wrap">
                <Badge variant="outline" className="text-[10px]">{currentSession.title}</Badge>
                <Badge variant={isRunning ? "success" : "warning"} className="text-[10px] capitalize">{currentSession.status}</Badge>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!currentSession ? (
            /* ── Setup form ── */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Titre de la session</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Service Dominical" className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as any)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Service religieux</SelectItem>
                      <SelectItem value="meeting">Réunion</SelectItem>
                      <SelectItem value="event">Événement spécial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button size="default" onClick={handleStart} className="w-full sm:w-auto" disabled={!title.trim()}>
                <Play className="w-4 h-4 mr-2" />Démarrer la session
              </Button>
            </div>
          ) : (
            /* ── Live session ── */
            <div className="space-y-4">
              {/* Dual counter: members + visitors */}
              <div className="grid grid-cols-2 gap-3">
                {/* Members counter */}
                <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Membres</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={() => decrementCount(true)}>
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <motion.span key={currentSession.totalPresent} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                      className="text-3xl font-bold tabular-nums text-indigo-600 dark:text-indigo-300">
                      {currentSession.totalPresent}
                    </motion.span>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={() => incrementCount("male", "adult", true)}>
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Visitors counter */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500">Visiteurs</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={() => decrementCount(false)}>
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <motion.span key={currentSession.visitorCount} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                      className="text-3xl font-bold tabular-nums text-slate-500">
                      {currentSession.visitorCount}
                    </motion.span>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={() => incrementCount("male", "adult", false)}>
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Total bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3 h-3" />Total présents</span>
                  <span className="font-bold text-base">{total}</span>
                </div>
                <Progress value={memberRate} className="h-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{memberRate}% membres</span>
                  <span>{100 - memberRate}% visiteurs</span>
                </div>
              </div>

              {/* Mini breakdown grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "H", value: currentSession.maleCount,   color: "text-indigo-500" },
                  { label: "F", value: currentSession.femaleCount,  color: "text-pink-500" },
                  { label: "Ad", value: currentSession.adultCount,  color: "text-blue-500" },
                  { label: "Enf", value: currentSession.childCount, color: "text-emerald-500" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-lg bg-muted/50 p-2 text-center">
                    <motion.p key={value} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={cn("text-lg font-bold tabular-nums", color)}>
                      {value}
                    </motion.p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* AI Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-accent/30">
                <Cpu className={cn("w-4 h-4", aiRunning ? "text-primary animate-pulse" : "text-muted-foreground")} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">Détection IA automatique</p>
                  <p className="text-[10px] text-muted-foreground">Simule la détection temps réel — membres et inconnus</p>
                </div>
                <Switch checked={aiRunning} onCheckedChange={toggleAI} disabled={!isRunning} />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                {isRunning && (
                  <Button variant="outline" size="sm" onClick={pauseSession}>
                    <Pause className="w-3.5 h-3.5 mr-1.5" />Pause
                  </Button>
                )}
                {isPaused && (
                  <Button variant="outline" size="sm" onClick={resumeSession}>
                    <PlayCircle className="w-3.5 h-3.5 mr-1.5" />Reprendre
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={handleEnd}>
                  <Square className="w-3.5 h-3.5 mr-1.5" />Terminer
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
