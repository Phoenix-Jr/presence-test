import { create } from "zustand";
import type { AttendanceSession, AttendanceRecord, AIDetectionEvent, Visitor } from "@/types";
import { MOCK_SESSIONS, MOCK_ATTENDANCE_RECORDS, MOCK_VISITORS } from "@/lib/data/attendance";

interface AttendanceState {
  sessions: AttendanceSession[];
  currentSession: AttendanceSession | null;
  currentRecords: AttendanceRecord[];
  currentVisitors: Visitor[];
  detectionEvents: AIDetectionEvent[];
  allVisitors: Visitor[];
  aiRunning: boolean;

  startSession: (title: string, type: AttendanceSession["type"]) => void;
  endSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;

  incrementCount: (gender: "male" | "female", ageGroup: "child" | "adult", isKnown: boolean) => void;
  decrementCount: (isKnown: boolean) => void;

  markPresent: (memberId: string, memberName: string, gender: "male" | "female", ageGroup: "child" | "youth" | "adult" | "senior") => void;
  markAbsent: (memberId: string) => void;

  addDetectionEvent: (event: AIDetectionEvent) => void;
  addVisitor: (visitor: Omit<Visitor, "id">) => void;
  updateVisitor: (id: string, patch: Partial<Visitor>) => void;
  convertVisitorToMember: (visitorId: string, memberId: string) => void;
  toggleAI: () => void;
}

export const useAttendanceStore = create<AttendanceState>()((set, get) => ({
  sessions: MOCK_SESSIONS,
  currentSession: null,
  currentRecords: [],
  currentVisitors: [],
  detectionEvents: [],
  allVisitors: MOCK_VISITORS,
  aiRunning: false,

  startSession: (title, type) => {
    const session: AttendanceSession = {
      id: `s-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title, type,
      status: "running",
      totalPresent: 0,
      totalMembers: 160,
      visitorCount: 0,
      maleCount: 0, femaleCount: 0,
      childCount: 0, adultCount: 0,
      detectedBy: "ai",
      startedAt: new Date().toISOString(),
    };
    set({ currentSession: session, currentRecords: [], currentVisitors: [], detectionEvents: [] });
  },

  endSession: () => {
    const { currentSession, sessions, currentVisitors, allVisitors } = get();
    if (!currentSession) return;
    const ended: AttendanceSession = { ...currentSession, status: "completed", endedAt: new Date().toISOString() };
    set({
      sessions: [ended, ...sessions],
      currentSession: null,
      aiRunning: false,
      currentRecords: [],
      currentVisitors: [],
      detectionEvents: [],
      allVisitors: [...allVisitors, ...currentVisitors],
    });
  },

  pauseSession: () =>
    set((s) => ({
      currentSession: s.currentSession ? { ...s.currentSession, status: "paused" } : null,
      aiRunning: false,
    })),

  resumeSession: () =>
    set((s) => ({
      currentSession: s.currentSession ? { ...s.currentSession, status: "running" } : null,
    })),

  incrementCount: (gender, ageGroup, isKnown) =>
    set((s) => {
      if (!s.currentSession) return s;
      return {
        currentSession: {
          ...s.currentSession,
          totalPresent: isKnown ? s.currentSession.totalPresent + 1 : s.currentSession.totalPresent,
          visitorCount: !isKnown ? s.currentSession.visitorCount + 1 : s.currentSession.visitorCount,
          maleCount: gender === "male" ? s.currentSession.maleCount + 1 : s.currentSession.maleCount,
          femaleCount: gender === "female" ? s.currentSession.femaleCount + 1 : s.currentSession.femaleCount,
          childCount: ageGroup === "child" ? s.currentSession.childCount + 1 : s.currentSession.childCount,
          adultCount: ageGroup === "adult" ? s.currentSession.adultCount + 1 : s.currentSession.adultCount,
        },
      };
    }),

  decrementCount: (isKnown) =>
    set((s) => {
      if (!s.currentSession) return s;
      const session = s.currentSession;
      if (isKnown && session.totalPresent <= 0) return s;
      if (!isKnown && session.visitorCount <= 0) return s;
      return {
        currentSession: {
          ...session,
          totalPresent: isKnown ? session.totalPresent - 1 : session.totalPresent,
          visitorCount: !isKnown ? session.visitorCount - 1 : session.visitorCount,
        },
      };
    }),

  markPresent: (memberId, memberName, gender, ageGroup) => {
    const { currentSession, currentRecords } = get();
    if (!currentSession) return;
    const existing = currentRecords.find((r) => r.memberId === memberId);
    if (existing) {
      set((s) => ({
        currentRecords: s.currentRecords.map((r) =>
          r.memberId === memberId
            ? { ...r, status: "present" as const, detectedAt: new Date().toISOString() }
            : r
        ),
      }));
      return;
    }
    const record: AttendanceRecord = {
      id: `r-${Date.now()}`,
      sessionId: currentSession.id,
      memberId, memberName,
      status: "present",
      detectedAt: new Date().toISOString(),
      method: "manual",
      gender, ageGroup,
    };
    set((s) => ({ currentRecords: [...s.currentRecords, record] }));
  },

  markAbsent: (memberId) =>
    set((s) => ({
      currentRecords: s.currentRecords.map((r) =>
        r.memberId === memberId ? { ...r, status: "absent" as const } : r
      ),
    })),

  addDetectionEvent: (event) => {
    set((s) => ({
      detectionEvents: [event, ...s.detectionEvents].slice(0, 60),
    }));
    if (event.action === "enter") {
      get().incrementCount(event.gender, event.ageGroup === "child" ? "child" : "adult", event.isKnown);
      if (!event.isKnown) {
        const visitor: Omit<Visitor, "id"> = {
          sessionId: get().currentSession?.id ?? "live",
          detectedAt: event.timestamp,
          gender: event.gender,
          ageGroup: event.ageGroup,
          confidence: event.confidence,
          status: "pending",
        };
        get().addVisitor(visitor);
      }
    } else {
      get().decrementCount(event.isKnown);
    }
  },

  addVisitor: (visitor) =>
    set((s) => ({
      currentVisitors: [{ ...visitor, id: `v-live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }, ...s.currentVisitors],
    })),

  updateVisitor: (id, patch) =>
    set((s) => ({
      currentVisitors: s.currentVisitors.map((v) => (v.id === id ? { ...v, ...patch } : v)),
      allVisitors: s.allVisitors.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    })),

  convertVisitorToMember: (visitorId, memberId) =>
    set((s) => ({
      currentVisitors: s.currentVisitors.map((v) =>
        v.id === visitorId ? { ...v, status: "converted" as const, convertedMemberId: memberId } : v
      ),
      allVisitors: s.allVisitors.map((v) =>
        v.id === visitorId ? { ...v, status: "converted" as const, convertedMemberId: memberId } : v
      ),
    })),

  toggleAI: () => set((s) => ({ aiRunning: !s.aiRunning })),
}));
