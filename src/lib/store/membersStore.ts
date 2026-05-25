import { create } from "zustand";
import type { Member } from "@/types";
import { MOCK_MEMBERS } from "@/lib/data/members";

interface MembersState {
  members: Member[];
  searchQuery: string;
  filterStatus: "all" | "active" | "inactive";
  filterGender: "all" | "male" | "female";
  filterAgeGroup: "all" | "child" | "youth" | "adult" | "senior";
  filterGroup: string;
  setSearch: (q: string) => void;
  setFilterStatus: (s: MembersState["filterStatus"]) => void;
  setFilterGender: (g: MembersState["filterGender"]) => void;
  setFilterAgeGroup: (a: MembersState["filterAgeGroup"]) => void;
  setFilterGroup: (g: string) => void;
  addMember: (m: Omit<Member, "id" | "attendanceRate" | "totalAttended" | "totalSessions">) => void;
  updateMember: (id: string, patch: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  filteredMembers: () => Member[];
}

export const useMembersStore = create<MembersState>()((set, get) => ({
  members: MOCK_MEMBERS,
  searchQuery: "",
  filterStatus: "all",
  filterGender: "all",
  filterAgeGroup: "all",
  filterGroup: "all",

  setSearch: (q) => set({ searchQuery: q }),
  setFilterStatus: (s) => set({ filterStatus: s }),
  setFilterGender: (g) => set({ filterGender: g }),
  setFilterAgeGroup: (a) => set({ filterAgeGroup: a }),
  setFilterGroup: (g) => set({ filterGroup: g }),

  addMember: (data) => {
    const newMember: Member = {
      ...data,
      id: `m-${Date.now()}`,
      attendanceRate: 0,
      totalAttended: 0,
      totalSessions: 0,
    };
    set((s) => ({ members: [newMember, ...s.members] }));
  },

  updateMember: (id, patch) =>
    set((s) => ({
      members: s.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),

  deleteMember: (id) =>
    set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

  filteredMembers: () => {
    const { members, searchQuery, filterStatus, filterGender, filterAgeGroup, filterGroup } = get();
    return members.filter((m) => {
      const q = searchQuery.toLowerCase();
      if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
      if (filterStatus !== "all" && m.status !== filterStatus) return false;
      if (filterGender !== "all" && m.gender !== filterGender) return false;
      if (filterAgeGroup !== "all" && m.ageGroup !== filterAgeGroup) return false;
      if (filterGroup !== "all" && m.group !== filterGroup) return false;
      return true;
    });
  },
}));
