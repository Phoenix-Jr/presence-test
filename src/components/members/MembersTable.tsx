"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, UserPlus, Download, Edit2, Trash2,
  ChevronUp, ChevronDown, MoreHorizontal, Mail, Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { MemberModal } from "./MemberModal";
import { useMembers } from "@/lib/hooks/useMembers";
import { exportMembersCSV } from "@/lib/utils/export";
import { formatDate } from "@/lib/utils/format";
import type { Member } from "@/types";
import { cn } from "@/lib/utils/cn";

type SortKey = "name" | "attendanceRate" | "joinedAt";

const AGE_COLORS: Record<string, string> = {
  child: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30",
  youth: "text-blue-600 bg-blue-50 dark:bg-blue-900/30",
  adult: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30",
  senior: "text-purple-600 bg-purple-50 dark:bg-purple-900/30",
};

export function MembersTable() {
  const {
    members, allMembers, isLoading, searchQuery, filterStatus, filterGender, filterAgeGroup,
    setSearch, setFilterStatus, setFilterGender, setFilterAgeGroup,
    addMember, updateMember, deleteMember, isAdding, isUpdating,
  } = useMembers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filtersVisible, setFiltersVisible] = useState(false);

  const sorted = [...members].sort((a, b) => {
    let av = a[sortKey] as string | number;
    let bv = b[sortKey] as string | number;
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    return sortDir === "asc" ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
    ) : <ChevronUp className="w-3.5 h-3.5 opacity-30" />;

  const handleDelete = async (m: Member) => {
    if (!confirm(`Delete ${m.name}?`)) return;
    await deleteMember(m.id);
    toast.success(`${m.name} has been removed.`);
  };

  const handleSave = async (data: any) => {
    if (editMember) {
      await updateMember(editMember.id, data);
    } else {
      await addMember(data);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex gap-3">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-border/40 last:border-0">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="space-y-3">
          {/* Search + actions bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersVisible((v) => !v)}
              className={cn(filtersVisible && "bg-accent")}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {(filterStatus !== "all" || filterGender !== "all" || filterAgeGroup !== "all") && (
                <span className="ml-1.5 h-4 w-4 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportMembersCSV(allMembers)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => { setEditMember(null); setModalOpen(true); }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {filtersVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 pt-1">
                  <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterGender} onValueChange={(v) => setFilterGender(v as any)}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterAgeGroup} onValueChange={(v) => setFilterAgeGroup(v as any)}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue placeholder="Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="youth">Youth</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" className="h-8 text-xs"
                    onClick={() => { setFilterStatus("all"); setFilterGender("all"); setFilterAgeGroup("all"); setSearch(""); }}>
                    Clear filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-muted-foreground">
            Showing {sorted.length} of {allMembers.length} members
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground">
                    <button className="flex items-center gap-1.5" onClick={() => handleSort("name")}>
                      Member <SortIcon k="name" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Gender</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Age Group</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Group</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    <button className="flex items-center gap-1.5" onClick={() => handleSort("attendanceRate")}>
                      Attendance <SortIcon k="attendanceRate" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    <button className="flex items-center gap-1.5" onClick={() => handleSort("joinedAt")}>
                      Joined <SortIcon k="joinedAt" />
                    </button>
                  </th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sorted.map((m, i) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium leading-none">{m.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">{m.gender}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium capitalize", AGE_COLORS[m.ageGroup])}>
                          {m.ageGroup}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{m.group ?? "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={m.attendanceRate} className="w-16 h-1.5" />
                          <span className="text-xs font-semibold w-9">{m.attendanceRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={m.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(m.joinedAt)}</td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditMember(m); setModalOpen(true); }}>
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            {m.email && (
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${m.email}`}>
                                  <Mail className="w-4 h-4" />
                                  Send Email
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={() => handleDelete(m)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground text-sm">
                      No members match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border/40">
            {sorted.map((m) => (
              <div key={m.id} className="p-4 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{m.gender} · {m.ageGroup}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={m.attendanceRate} className="w-14 h-1" />
                    <span className="text-xs text-muted-foreground">{m.attendanceRate}%</span>
                    <StatusBadge status={m.status} />
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditMember(m); setModalOpen(true); }}>
                      <Edit2 className="w-4 h-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(m)}>
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <MemberModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditMember(null); }}
        member={editMember}
        onSave={handleSave}
        isSaving={isAdding || isUpdating}
      />
    </>
  );
}
