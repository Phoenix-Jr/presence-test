import { useQuery } from "@tanstack/react-query";
import { MOCK_ATTENDANCE_TRENDS } from "@/lib/data/attendance";
import { GROUP_DISTRIBUTION, MOCK_ENGAGEMENT, AI_INSIGHTS } from "@/lib/data/analytics";
import { useMembersStore } from "@/lib/store/membersStore";

async function fetchAnalytics() {
  await new Promise((r) => setTimeout(r, 800));
  const members = useMembersStore.getState().members;
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === "active").length;
  const avgRate = members.reduce((s, m) => s + m.attendanceRate, 0) / totalMembers;

  return {
    trends: MOCK_ATTENDANCE_TRENDS,
    distribution: GROUP_DISTRIBUTION,
    engagement: MOCK_ENGAGEMENT,
    insights: AI_INSIGHTS,
    summary: {
      totalMembers,
      activeMembers,
      avgAttendanceRate: Math.round(avgRate),
    },
  };
}

export function useAnalytics(dateFilter?: string, groupFilter?: string) {
  const query = useQuery({
    queryKey: ["analytics", dateFilter, groupFilter],
    queryFn: fetchAnalytics,
    staleTime: 60_000,
  });

  return {
    trends: query.data?.trends ?? [],
    distribution: query.data?.distribution ?? [],
    engagement: query.data?.engagement ?? [],
    insights: query.data?.insights ?? [],
    summary: query.data?.summary,
    isLoading: query.isLoading,
    topMembers: (query.data?.engagement ?? []).filter((e) => e.attendanceRate >= 80).slice(0, 5),
    leastActive: (query.data?.engagement ?? []).filter((e) => e.attendanceRate < 50).slice(0, 5),
  };
}
