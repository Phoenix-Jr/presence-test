import type { Member, AttendanceSession, AttendanceRecord } from "@/types";

function toCSV(headers: string[], rows: string[][]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
}

function download(content: string, filename: string, mimeType = "text/csv") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportMembersCSV(members: Member[]) {
  const headers = ["ID", "Name", "Email", "Gender", "Age Group", "Status", "Attendance Rate (%)", "Total Attended", "Total Sessions", "Joined At", "Last Seen"];
  const rows = members.map((m) => [
    m.id,
    m.name,
    m.email,
    m.gender,
    m.ageGroup,
    m.status,
    String(m.attendanceRate.toFixed(1)),
    String(m.totalAttended),
    String(m.totalSessions),
    m.joinedAt,
    m.lastSeen ?? "",
  ]);
  download(toCSV(headers, rows), `members-${Date.now()}.csv`);
}

export function exportSessionCSV(session: AttendanceSession, records: AttendanceRecord[]) {
  const headers = ["Record ID", "Member", "Status", "Method", "Gender", "Age Group", "Detected At"];
  const rows = records.map((r) => [
    r.id,
    r.memberName,
    r.status,
    r.method,
    r.gender,
    r.ageGroup,
    r.detectedAt ?? "",
  ]);
  download(toCSV(headers, rows), `session-${session.id}-${Date.now()}.csv`);
}
