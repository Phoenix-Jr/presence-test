import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMembersStore } from "@/lib/store/membersStore";
import type { Member } from "@/types";

// Simulate async fetch from "API"
async function fetchMembers(): Promise<Member[]> {
  await new Promise((r) => setTimeout(r, 600));
  return useMembersStore.getState().members;
}

export function useMembers() {
  const store = useMembersStore();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: async (data: Omit<Member, "id" | "attendanceRate" | "totalAttended" | "totalSessions">) => {
      await new Promise((r) => setTimeout(r, 400));
      store.addMember(data);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Member> }) => {
      await new Promise((r) => setTimeout(r, 400));
      store.updateMember(id, patch);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 300));
      store.deleteMember(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });

  return {
    members: store.filteredMembers(),
    allMembers: store.members,
    isLoading: query.isLoading,
    searchQuery: store.searchQuery,
    filterStatus: store.filterStatus,
    filterGender: store.filterGender,
    filterAgeGroup: store.filterAgeGroup,
    filterGroup: store.filterGroup,
    setSearch: store.setSearch,
    setFilterStatus: store.setFilterStatus,
    setFilterGender: store.setFilterGender,
    setFilterAgeGroup: store.setFilterAgeGroup,
    setFilterGroup: store.setFilterGroup,
    addMember: addMutation.mutateAsync,
    updateMember: (id: string, patch: Partial<Member>) => updateMutation.mutateAsync({ id, patch }),
    deleteMember: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
