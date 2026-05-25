import type {
  AttendanceSession, AttendanceRecord, AttendanceTrend,
  ActivityItem, Visitor, HeatmapCell,
} from "@/types";

export const MOCK_SESSIONS: AttendanceSession[] = [
  {
    id: "s-001", date: "2024-12-22", title: "Sunday Morning Service", type: "service",
    status: "completed", totalPresent: 142, totalMembers: 160, visitorCount: 17,
    maleCount: 58, femaleCount: 62, childCount: 22, adultCount: 120,
    detectedBy: "ai", startedAt: "2024-12-22T09:00:00Z", endedAt: "2024-12-22T11:30:00Z",
  },
  {
    id: "s-002", date: "2024-12-15", title: "Sunday Morning Service", type: "service",
    status: "completed", totalPresent: 138, totalMembers: 160, visitorCount: 12,
    maleCount: 55, femaleCount: 61, childCount: 22, adultCount: 116,
    detectedBy: "mixed", startedAt: "2024-12-15T09:00:00Z", endedAt: "2024-12-15T11:25:00Z",
  },
  {
    id: "s-003", date: "2024-12-11", title: "Wednesday Bible Study", type: "meeting",
    status: "completed", totalPresent: 63, totalMembers: 160, visitorCount: 3,
    maleCount: 28, femaleCount: 31, childCount: 4, adultCount: 59,
    detectedBy: "manual", startedAt: "2024-12-11T18:00:00Z", endedAt: "2024-12-11T20:00:00Z",
  },
  {
    id: "s-004", date: "2024-12-08", title: "Sunday Morning Service", type: "service",
    status: "completed", totalPresent: 151, totalMembers: 160, visitorCount: 21,
    maleCount: 62, femaleCount: 67, childCount: 22, adultCount: 129,
    detectedBy: "ai", startedAt: "2024-12-08T09:00:00Z", endedAt: "2024-12-08T11:35:00Z",
  },
  {
    id: "s-005", date: "2024-12-01", title: "Sunday Morning Service", type: "service",
    status: "completed", totalPresent: 133, totalMembers: 158, visitorCount: 8,
    maleCount: 52, femaleCount: 59, childCount: 22, adultCount: 111,
    detectedBy: "ai", startedAt: "2024-12-01T09:00:00Z", endedAt: "2024-12-01T11:20:00Z",
  },
  {
    id: "s-006", date: "2024-11-24", title: "Sunday Morning Service", type: "service",
    status: "completed", totalPresent: 119, totalMembers: 158, visitorCount: 6,
    maleCount: 47, femaleCount: 52, childCount: 20, adultCount: 99,
    detectedBy: "ai", startedAt: "2024-11-24T09:00:00Z", endedAt: "2024-11-24T11:25:00Z",
  },
];

export const MOCK_VISITORS: Visitor[] = [
  { id: "v-001", sessionId: "s-001", detectedAt: "2024-12-22T09:12:00Z", gender: "female", ageGroup: "adult", confidence: 0.87, status: "pending", tempName: "Unknown F-1" },
  { id: "v-002", sessionId: "s-001", detectedAt: "2024-12-22T09:18:00Z", gender: "male", ageGroup: "youth", confidence: 0.91, status: "converted", tempName: "Jean Kouassi", tempPhone: "+1-555-0200", convertedMemberId: "m-new-1" },
  { id: "v-003", sessionId: "s-001", detectedAt: "2024-12-22T09:25:00Z", gender: "male", ageGroup: "adult", confidence: 0.79, status: "recurring", tempName: "Recurring visitor M-3" },
  { id: "v-004", sessionId: "s-001", detectedAt: "2024-12-22T09:30:00Z", gender: "female", ageGroup: "child", confidence: 0.94, status: "pending" },
  { id: "v-005", sessionId: "s-001", detectedAt: "2024-12-22T09:41:00Z", gender: "male", ageGroup: "senior", confidence: 0.82, status: "pending" },
  { id: "v-006", sessionId: "s-004", detectedAt: "2024-12-08T09:09:00Z", gender: "female", ageGroup: "adult", confidence: 0.88, status: "converted", tempName: "Marie Dubois", convertedMemberId: "m-new-2" },
  { id: "v-007", sessionId: "s-004", detectedAt: "2024-12-08T09:22:00Z", gender: "male", ageGroup: "adult", confidence: 0.75, status: "recurring" },
];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { id: "r-001", sessionId: "s-001", memberId: "m-001", memberName: "James Okafor", status: "present", detectedAt: "2024-12-22T09:03:00Z", method: "ai", gender: "male", ageGroup: "adult" },
  { id: "r-002", sessionId: "s-001", memberId: "m-002", memberName: "Grace Mensah", status: "present", detectedAt: "2024-12-22T09:05:00Z", method: "ai", gender: "female", ageGroup: "adult" },
  { id: "r-003", sessionId: "s-001", memberId: "m-003", memberName: "Emmanuel Boateng", status: "absent", method: "manual", gender: "male", ageGroup: "youth" },
  { id: "r-004", sessionId: "s-001", memberId: "m-004", memberName: "Priscilla Anning", status: "present", detectedAt: "2024-12-22T08:58:00Z", method: "ai", gender: "female", ageGroup: "adult" },
  { id: "r-005", sessionId: "s-001", memberId: "m-005", memberName: "Daniel Kwame", status: "late", detectedAt: "2024-12-22T09:45:00Z", method: "manual", gender: "male", ageGroup: "adult" },
  { id: "r-006", sessionId: "s-001", memberId: "m-006", memberName: "Abena Tawiah", status: "present", detectedAt: "2024-12-22T09:01:00Z", method: "ai", gender: "female", ageGroup: "senior" },
  { id: "r-007", sessionId: "s-001", memberId: "m-007", memberName: "Kofi Asante", status: "absent", method: "manual", gender: "male", ageGroup: "youth" },
  { id: "r-008", sessionId: "s-001", memberId: "m-008", memberName: "Lydia Owusu", status: "present", detectedAt: "2024-12-22T09:07:00Z", method: "ai", gender: "female", ageGroup: "adult" },
];

export const MOCK_ATTENDANCE_TRENDS: AttendanceTrend[] = [
  { date: "Oct 6",  present: 112, absent: 46, visitors: 7,  rate: 71 },
  { date: "Oct 13", present: 118, absent: 40, visitors: 9,  rate: 75 },
  { date: "Oct 20", present: 125, absent: 33, visitors: 11, rate: 79 },
  { date: "Oct 27", present: 121, absent: 37, visitors: 8,  rate: 77 },
  { date: "Nov 3",  present: 130, absent: 28, visitors: 14, rate: 82 },
  { date: "Nov 10", present: 127, absent: 31, visitors: 10, rate: 80 },
  { date: "Nov 17", present: 134, absent: 24, visitors: 15, rate: 85 },
  { date: "Nov 24", present: 119, absent: 39, visitors: 6,  rate: 75 },
  { date: "Dec 1",  present: 133, absent: 25, visitors: 8,  rate: 84 },
  { date: "Dec 8",  present: 151, absent: 9,  visitors: 21, rate: 94 },
  { date: "Dec 15", present: 138, absent: 22, visitors: 12, rate: 86 },
  { date: "Dec 22", present: 142, absent: 18, visitors: 17, rate: 89 },
];

/** Generate heatmap cells for the last 16 weeks */
export const MOCK_HEATMAP: HeatmapCell[] = (() => {
  const cells: HeatmapCell[] = [];
  const base = new Date("2024-09-01");
  for (let i = 0; i < 112; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const isSunday = d.getDay() === 0;
    const isWed = d.getDay() === 3;
    if (!isSunday && !isWed) {
      cells.push({ date: d.toISOString().split("T")[0], count: 0, rate: 0 });
      continue;
    }
    const count = isSunday
      ? 105 + Math.floor(Math.random() * 55)
      : 45 + Math.floor(Math.random() * 25);
    cells.push({
      date: d.toISOString().split("T")[0],
      count,
      rate: Math.round((count / 160) * 100),
    });
  }
  return cells;
})();

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a-001", type: "visitor", message: "3 nouveaux visiteurs détectés par l'IA", timestamp: "2024-12-22T09:30:00Z" },
  { id: "a-002", type: "check_in", message: "Grace Mensah s'est connectée", timestamp: "2024-12-22T09:05:00Z", actor: "Grace Mensah" },
  { id: "a-003", type: "conversion", message: "Jean Kouassi — visiteur converti en membre", timestamp: "2024-12-22T09:50:00Z" },
  { id: "a-004", type: "check_in", message: "Priscilla Anning s'est connectée", timestamp: "2024-12-22T08:58:00Z", actor: "Priscilla Anning" },
  { id: "a-005", type: "session_start", message: "Session Dimanche démarrée", timestamp: "2024-12-22T09:00:00Z" },
  { id: "a-006", type: "check_in", message: "James Okafor s'est connecté", timestamp: "2024-12-22T09:03:00Z", actor: "James Okafor" },
  { id: "a-007", type: "new_member", message: "Nouveau membre ajouté: Kwabena Poku", timestamp: "2024-12-20T14:30:00Z" },
  { id: "a-008", type: "alert", message: "Kofi Asante absent depuis 6 semaines", timestamp: "2024-12-20T08:00:00Z" },
  { id: "a-009", type: "check_in", message: "Abena Tawiah s'est connectée", timestamp: "2024-12-22T09:01:00Z", actor: "Abena Tawiah" },
  { id: "a-010", type: "session_end", message: "Session terminée — 142 membres + 17 visiteurs", timestamp: "2024-12-22T11:30:00Z" },
];
