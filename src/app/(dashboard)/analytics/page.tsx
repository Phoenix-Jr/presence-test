"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Filter, CalendarDays, Users } from "lucide-react";
import { toast } from "sonner";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { TrendsChart } from "@/components/analytics/TrendsChart";
import { TopMembersCard } from "@/components/analytics/TopMembersCard";
import { EngagementBarChart } from "@/components/analytics/EngagementBarChart";
import { DistributionChart } from "@/components/dashboard/DistributionChart";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { exportMembersCSV } from "@/lib/utils/export";
import { useMembersStore } from "@/lib/store/membersStore";

export default function AnalyticsPage() {
  const [dateFilter, setDateFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const { trends, distribution, engagement, insights, topMembers, leastActive, isLoading, summary } = useAnalytics(dateFilter, groupFilter);
  const allMembers = useMembersStore((s) => s.members);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">In-depth attendance insights and member engagement.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-36 h-9">
              <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="1w">Last Week</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-36 h-9">
              <Users className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="choir">Choir</SelectItem>
              <SelectItem value="youth">Youth</SelectItem>
              <SelectItem value="ushers">Ushers</SelectItem>
              <SelectItem value="deacons">Deacons</SelectItem>
              <SelectItem value="children">Children</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => { exportMembersCSV(allMembers); toast.success("Members CSV exported"); }}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Members", value: summary.totalMembers },
            { label: "Active Members", value: summary.activeMembers },
            { label: "Avg. Attendance Rate", value: `${summary.avgAttendanceRate}%` },
          ].map(({ label, value }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Trends chart - full width */}
      <TrendsChart data={trends} isLoading={isLoading} />

      {/* Top / Least active members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopMembersCard members={topMembers} title="Most Faithful Members" variant="top" isLoading={isLoading} />
        <TopMembersCard members={leastActive} title="Least Active Members" variant="least" isLoading={isLoading} />
      </div>

      {/* Engagement bar chart + distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EngagementBarChart engagement={engagement} isLoading={isLoading} />
        </div>
        <DistributionChart data={distribution} isLoading={isLoading} />
      </div>

      {/* AI Insights */}
      <InsightsPanel insights={insights} isLoading={isLoading} />
    </div>
  );
}
