"use client";

import { motion } from "framer-motion";
import { Flame, Award, UserPlus, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_ENGAGEMENT } from "@/lib/data/analytics";
import { useMembersStore } from "@/lib/store/membersStore";
import { MOCK_VISITORS } from "@/lib/data/attendance";
import { cn } from "@/lib/utils/cn";

export function QuickStats() {
  const members = useMembersStore((s) => s.members);
  const totalActive = members.filter((m) => m.status === "active").length;
  const topStreak = MOCK_ENGAGEMENT.reduce((max, m) => Math.max(max, m.streak), 0);
  const totalVisitors = MOCK_VISITORS.length;
  const converted = MOCK_VISITORS.filter((v) => v.status === "converted").length;
  const convRate = totalVisitors > 0 ? Math.round((converted / totalVisitors) * 100) : 0;
  const avgRate = members.length > 0
    ? Math.round(members.reduce((s, m) => s + m.attendanceRate, 0) / members.length)
    : 0;

  const stats = [
    { icon: Flame, label: "Meilleure série", value: `${topStreak} sem.`, color: "text-orange-500", bg: "bg-orange-500/10", progress: (topStreak / 30) * 100 },
    { icon: Award, label: "Taux moyen", value: `${avgRate}%`, color: "text-indigo-500", bg: "bg-indigo-500/10", progress: avgRate },
    { icon: UserPlus, label: "Conversion visiteurs", value: `${convRate}%`, color: "text-emerald-500", bg: "bg-emerald-500/10", progress: convRate },
    { icon: CalendarCheck, label: "Membres actifs", value: totalActive, color: "text-blue-500", bg: "bg-blue-500/10", progress: (totalActive / members.length) * 100 },
  ];

  return (
    <Card>
      <CardContent className="p-4 grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value, color, bg, progress }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className="space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-md", bg)}>
                <Icon className={cn("w-3.5 h-3.5", color)} />
              </div>
              <span className="text-xs text-muted-foreground truncate">{label}</span>
            </div>
            <p className="text-lg font-bold pl-0.5">{value}</p>
            <Progress value={progress} className="h-1" />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
