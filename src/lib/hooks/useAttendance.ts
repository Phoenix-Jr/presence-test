"use client";

import { useEffect, useRef } from "react";
import { useAttendanceStore } from "@/lib/store/attendanceStore";
import { useMembersStore } from "@/lib/store/membersStore";
import type { AIDetectionEvent } from "@/types";

const GENDERS = ["male", "female"] as const;
const AGE_GROUPS = ["child", "youth", "adult", "senior"] as const;

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useAttendance() {
  const store = useAttendanceStore();
  const members = useMembersStore((s) => s.members);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (store.aiRunning && store.currentSession?.status === "running") {
      intervalRef.current = setInterval(() => {
        const gender = randomFrom(GENDERS);
        const ageGroup = randomFrom(AGE_GROUPS);
        const confidence = 0.65 + Math.random() * 0.35;
        const action: "enter" | "exit" = Math.random() > 0.15 ? "enter" : "exit";

        // 70% chance known member, 30% unknown visitor
        const isKnown = Math.random() > 0.30;
        const activeMembers = members.filter((m) => m.status === "active");
        const matchedMember = isKnown && activeMembers.length > 0
          ? activeMembers[Math.floor(Math.random() * activeMembers.length)]
          : null;

        const event: AIDetectionEvent = {
          id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          timestamp: new Date().toISOString(),
          gender: matchedMember ? matchedMember.gender : gender,
          ageGroup: matchedMember
            ? (matchedMember.ageGroup as (typeof AGE_GROUPS)[number])
            : ageGroup,
          confidence,
          action,
          isKnown: !!matchedMember,
          memberId: matchedMember?.id,
          memberName: matchedMember?.name,
        };
        store.addDetectionEvent(event);
      }, 1800 + Math.random() * 1400);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.aiRunning, store.currentSession?.status]);

  return {
    sessions: store.sessions,
    currentSession: store.currentSession,
    currentRecords: store.currentRecords,
    currentVisitors: store.currentVisitors,
    allVisitors: store.allVisitors,
    detectionEvents: store.detectionEvents,
    aiRunning: store.aiRunning,
    startSession: store.startSession,
    endSession: store.endSession,
    pauseSession: store.pauseSession,
    resumeSession: store.resumeSession,
    markPresent: store.markPresent,
    markAbsent: store.markAbsent,
    toggleAI: store.toggleAI,
    incrementCount: store.incrementCount,
    decrementCount: store.decrementCount,
    updateVisitor: store.updateVisitor,
    convertVisitorToMember: store.convertVisitorToMember,
  };
}
