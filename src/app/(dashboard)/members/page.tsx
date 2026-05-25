"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { MembersTable } from "@/components/members/MembersTable";
import { Card } from "@/components/ui/card";
import { useMembersStore } from "@/lib/store/membersStore";

function MemberStatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: React.ElementType; color: string }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}

export default function MembersPage() {
  const members = useMembersStore((s) => s.members);
  const active = members.filter((m) => m.status === "active").length;
  const inactive = members.filter((m) => m.status === "inactive").length;
  const avgRate = members.length > 0 ? Math.round(members.reduce((s, m) => s + m.attendanceRate, 0) / members.length) : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold">Members</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your church member registry.</p>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MemberStatCard label="Total Members" value={members.length} icon={Users} color="bg-indigo-500/10 text-indigo-500" />
        <MemberStatCard label="Active" value={active} icon={UserCheck} color="bg-emerald-500/10 text-emerald-500" />
        <MemberStatCard label="Inactive" value={inactive} icon={UserX} color="bg-amber-500/10 text-amber-500" />
        <MemberStatCard label="Avg. Attendance" value={`${avgRate}%`} icon={TrendingUp} color="bg-blue-500/10 text-blue-500" />
      </div>

      <MembersTable />
    </div>
  );
}
