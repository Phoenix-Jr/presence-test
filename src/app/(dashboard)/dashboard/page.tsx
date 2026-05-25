"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users, UserCheck, TrendingUp, UserX, Eye, UserPlus, Calendar, RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { KPICard } from "@/components/dashboard/KPICard";
import { AttendanceLineChart } from "@/components/dashboard/AttendanceLineChart";
import { DistributionChart } from "@/components/dashboard/DistributionChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { LiveStatsBar } from "@/components/dashboard/LiveStatsBar";
import { SessionCompareChart } from "@/components/dashboard/SessionCompareChart";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { KPISkeleton } from "@/components/shared/KPISkeleton";
import { Button } from "@/components/ui/button";
import { MOCK_ATTENDANCE_TRENDS, MOCK_ACTIVITY } from "@/lib/data/attendance";
import { GROUP_DISTRIBUTION, AI_INSIGHTS } from "@/lib/data/analytics";
import { useMembersStore } from "@/lib/store/membersStore";
import { useAttendanceStore } from "@/lib/store/attendanceStore";
import type { SparklinePoint } from "@/types";

// Generate mini sparkline from last N trend values
function toSparkline(arr: number[]): SparklinePoint[] {
  return arr.map((v) => ({ v }));
}

const presentSparkline = toSparkline(MOCK_ATTENDANCE_TRENDS.slice(-8).map((t) => t.present));
const rateSparkline    = toSparkline(MOCK_ATTENDANCE_TRENDS.slice(-8).map((t) => t.rate));
const visitorSparkline = toSparkline(MOCK_ATTENDANCE_TRENDS.slice(-8).map((t) => t.visitors));
const absentSparkline  = toSparkline(MOCK_ATTENDANCE_TRENDS.slice(-8).map((t) => t.absent));

async function fetchKPIs() {
  await new Promise((r) => setTimeout(r, 600));
  const members = useMembersStore.getState().members;
  const sessions = useAttendanceStore.getState().sessions;
  const total = members.length;
  const avgRate = members.reduce((s, m) => s + m.attendanceRate, 0) / total;
  const totalVisitors = sessions.reduce((s, sess) => s + (sess.visitorCount ?? 0), 0);
  const newThisMonth = members.filter((m) => m.joinedAt >= "2024-12-01").length;
  return {
    totalMembers: total,
    presentToday: 142,
    attendanceRate: Math.round(avgRate),
    absenceRate: Math.round(100 - avgRate),
    visitorsToday: 17,
    visitorsTotal: totalVisitors,
    newThisMonth,
    trends: { members: 2.4, present: 12.1, rate: 3.2, absence: -3.2, visitors: 8.5, newMembers: 1 },
  };
}

export default function DashboardPage() {
  const { data: kpis, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["kpis"],
    queryFn: fetchKPIs,
    staleTime: 60_000,
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-3"
      >
        <div>
          <h2 className="text-xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { refetch(); toast.success("Données actualisées"); }} disabled={isFetching}>
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </motion.div>

      {/* Live session bar (only when a session is running) */}
      <LiveStatsBar />

      {/* KPI Cards — 6 cards in 2 rows */}
      {isLoading ? (
        <KPISkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPICard compact title="Total membres"  value={kpis?.totalMembers ?? 0}
            trend={kpis?.trends.members}   trendLabel="ce mois"
            icon={Users}     iconColor="text-indigo-500"  iconBg="bg-indigo-500/10"
            sparkline={presentSparkline}   sparklineColor="#6366f1" index={0} />
          <KPICard compact title="Présents auj."  value={kpis?.presentToday ?? 0}
            trend={kpis?.trends.present}   trendLabel="vs dim. dern."
            icon={UserCheck} iconColor="text-emerald-500" iconBg="bg-emerald-500/10"
            sparkline={presentSparkline}   sparklineColor="#10b981" index={1} />
          <KPICard compact title="Taux présence"  value={`${kpis?.attendanceRate ?? 0}%`}
            trend={kpis?.trends.rate}      trendLabel="vs mois dern."
            icon={TrendingUp} iconColor="text-blue-500"   iconBg="bg-blue-500/10"
            sparkline={rateSparkline}      sparklineColor="#3b82f6" index={2} />
          <KPICard compact title="Taux absence"   value={`${kpis?.absenceRate ?? 0}%`}
            trend={kpis?.trends.absence}   trendLabel="vs mois dern."
            icon={UserX}     iconColor="text-red-400"     iconBg="bg-red-400/10"
            sparkline={absentSparkline}    sparklineColor="#f43f5e" index={3} />
          <KPICard compact title="Visiteurs auj." value={kpis?.visitorsToday ?? 0}
            trend={kpis?.trends.visitors}  trendLabel="vs dim. dern."
            icon={Eye}       iconColor="text-slate-500"   iconBg="bg-slate-500/10"
            sparkline={visitorSparkline}   sparklineColor="#94a3b8" index={4} />
          <KPICard compact title="Nouveaux/mois"  value={kpis?.newThisMonth ?? 0}
            trend={kpis?.trends.newMembers} trendLabel="ce mois"
            icon={UserPlus}  iconColor="text-violet-500"  iconBg="bg-violet-500/10"
            index={5} />
        </div>
      )}

      {/* Row: Line chart + distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AttendanceLineChart data={MOCK_ATTENDANCE_TRENDS} isLoading={isLoading} />
        </div>
        <DistributionChart data={GROUP_DISTRIBUTION} isLoading={isLoading} />
      </div>

      {/* Row: Session compare + quick stats + activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SessionCompareChart data={MOCK_ATTENDANCE_TRENDS} isLoading={isLoading} />
        <QuickStats />
        <RecentActivity items={MOCK_ACTIVITY.slice(0, 5)} isLoading={isLoading} compact />
      </div>

      {/* AI Insights — full width */}
      <InsightsPanel insights={AI_INSIGHTS} isLoading={isLoading} />
    </div>
  );
}
