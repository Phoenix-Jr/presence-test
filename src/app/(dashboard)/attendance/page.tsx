"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionControl } from "@/components/attendance/SessionControl";
import { AIDetectionFeed } from "@/components/attendance/AIDetectionFeed";
import { ManualOverride } from "@/components/attendance/ManualOverride";
import { SessionHistory } from "@/components/attendance/SessionHistory";
import { VisitorTracker } from "@/components/attendance/VisitorTracker";
import { useAttendanceStore } from "@/lib/store/attendanceStore";
import { Badge } from "@/components/ui/badge";

export default function AttendancePage() {
  const currentSession = useAttendanceStore((s) => s.currentSession);
  const allVisitors    = useAttendanceStore((s) => s.allVisitors);
  const pendingVisitors = allVisitors.filter((v) => v.status === "pending").length;

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold">Gestion des présences</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Session live, détection IA, visiteurs inconnus, et historique complet.
          </p>
        </div>
        {pendingVisitors > 0 && (
          <Badge variant="warning" className="text-xs">
            {pendingVisitors} visiteur{pendingVisitors > 1 ? "s" : ""} en attente de suivi
          </Badge>
        )}
      </motion.div>

      <Tabs defaultValue="live">
        <TabsList className="mb-3">
          <TabsTrigger value="live" className="text-xs">Session live</TabsTrigger>
          <TabsTrigger value="visitors" className="text-xs">
            Visiteurs
            {pendingVisitors > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{pendingVisitors}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-xs">Saisie manuelle</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">Historique</TabsTrigger>
        </TabsList>

        {/* ── Live tab: 2-col session + AI, then visitor below ── */}
        <TabsContent value="live">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SessionControl />
            <AIDetectionFeed />
          </div>
          {currentSession && (
            <div className="mt-4">
              <VisitorTracker />
            </div>
          )}
        </TabsContent>

        {/* ── Visitors tab ── */}
        <TabsContent value="visitors">
          <div className="max-w-2xl">
            <VisitorTracker />
          </div>
        </TabsContent>

        {/* ── Manual tab ── */}
        <TabsContent value="manual">
          <div className="max-w-xl">
            <ManualOverride />
          </div>
        </TabsContent>

        {/* ── History tab ── */}
        <TabsContent value="history">
          <SessionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
