// ─── Core Domain Types ───────────────────────────────────────────────────────

export type Gender = "male" | "female";
export type AgeGroup = "child" | "youth" | "adult" | "senior";
export type MemberStatus = "active" | "inactive";
export type UserRole = "admin" | "staff";
export type SessionStatus = "idle" | "running" | "paused" | "completed";
export type AttendanceStatus = "present" | "absent" | "late";
export type VisitorStatus = "pending" | "converted" | "recurring";

// ─── Member ──────────────────────────────────────────────────────────────────

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender: Gender;
  ageGroup: AgeGroup;
  status: MemberStatus;
  joinedAt: string;
  avatarUrl?: string;
  attendanceRate: number;
  totalAttended: number;
  totalSessions: number;
  lastSeen?: string;
  group?: string;
  notes?: string;
}

// ─── Visitor (unknown / non-member) ──────────────────────────────────────────

export interface Visitor {
  id: string;
  sessionId: string;
  detectedAt: string;
  gender: Gender;
  ageGroup: AgeGroup;
  confidence: number;
  status: VisitorStatus;
  /** Set after staff interacts with them */
  tempName?: string;
  tempPhone?: string;
  notes?: string;
  /** If converted to a member */
  convertedMemberId?: string;
}

// ─── Attendance Session ───────────────────────────────────────────────────────

export interface AttendanceSession {
  id: string;
  date: string;
  title: string;
  type: "service" | "meeting" | "event";
  status: SessionStatus;
  totalPresent: number;
  totalMembers: number;
  visitorCount: number;
  maleCount: number;
  femaleCount: number;
  childCount: number;
  adultCount: number;
  detectedBy: "ai" | "manual" | "mixed";
  startedAt?: string;
  endedAt?: string;
  notes?: string;
}

// ─── Attendance Record ────────────────────────────────────────────────────────

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  memberId: string;
  memberName: string;
  status: AttendanceStatus;
  detectedAt?: string;
  method: "ai" | "manual";
  gender: Gender;
  ageGroup: AgeGroup;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AttendanceTrend {
  date: string;
  present: number;
  absent: number;
  visitors: number;
  rate: number;
}

export interface GroupDistribution {
  name: string;
  value: number;
  color: string;
}

export interface MemberEngagement {
  memberId: string;
  memberName: string;
  gender: Gender;
  ageGroup: AgeGroup;
  attendanceRate: number;
  streak: number;
  lastSeen: string;
  trend: "up" | "down" | "stable";
}

/** Monthly heatmap cell */
export interface HeatmapCell {
  date: string;   // ISO YYYY-MM-DD
  count: number;  // attendees
  rate: number;   // 0–100
}

/** Radar chart data for group comparison */
export interface GroupRadarData {
  group: string;
  attendance: number;
  consistency: number;
  growth: number;
  engagement: number;
  retention: number;
}

// ─── AI Detection Event ───────────────────────────────────────────────────────

export interface AIDetectionEvent {
  id: string;
  timestamp: string;
  gender: Gender;
  ageGroup: AgeGroup;
  confidence: number;
  action: "enter" | "exit";
  /** true = known member, false = unknown visitor */
  isKnown: boolean;
  memberId?: string;
  memberName?: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: "info" | "warning" | "success" | "alert";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  church: string;
}

// ─── KPI ──────────────────────────────────────────────────────────────────────

export interface KPIData {
  totalMembers: number;
  presentToday: number;
  attendanceRate: number;
  absenceRate: number;
  visitorsToday: number;
  newMembersThisMonth: number;
  activeSessions: number;
  conversionRate: number;
  trend: {
    members: number;
    present: number;
    rate: number;
    absence: number;
    visitors: number;
    conversion: number;
  };
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

export interface SparklinePoint {
  v: number;
}

// ─── Insight ──────────────────────────────────────────────────────────────────

export interface AIInsight {
  id: string;
  type: "warning" | "positive" | "suggestion";
  icon: string;
  title: string;
  description: string;
  metric?: string;
  actionLabel?: string;
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  type: "check_in" | "new_member" | "session_start" | "session_end" | "alert" | "visitor" | "conversion";
  message: string;
  timestamp: string;
  actor?: string;
  avatarUrl?: string;
}
