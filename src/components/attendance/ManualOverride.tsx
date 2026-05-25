"use client";

import { useState } from "react";
import { Check, X, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAttendance } from "@/lib/hooks/useAttendance";
import { useMembersStore } from "@/lib/store/membersStore";
import { cn } from "@/lib/utils/cn";

export function ManualOverride() {
  const { currentSession, currentRecords, markPresent, markAbsent } = useAttendance();
  const allMembers = useMembersStore((s) => s.members);
  const [query, setQuery] = useState("");

  const filtered = allMembers.filter(
    (m) => m.status === "active" && (query === "" || m.name.toLowerCase().includes(query.toLowerCase()))
  );

  const getRecordStatus = (memberId: string) => {
    return currentRecords.find((r) => r.memberId === memberId)?.status;
  };

  if (!currentSession) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Start a session to manually mark attendance.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Manual Attendance Override</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
          {filtered.map((m) => {
            const status = getRecordStatus(m.id);
            return (
              <div
                key={m.id}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg border transition-colors",
                  status === "present" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                    : status === "absent" ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                    : "border-border/40 hover:bg-accent/40"
                )}
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{m.ageGroup} · {m.gender}</p>
                </div>
                {status && (
                  <Badge variant={status === "present" ? "success" : "destructive"} className="capitalize text-[10px]">
                    {status}
                  </Badge>
                )}
                <div className="flex gap-1.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/40"
                    onClick={() => {
                      markPresent(m.id, m.name, m.gender, m.ageGroup);
                      toast.success(`${m.name} marked present`);
                    }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40"
                    onClick={() => {
                      markAbsent(m.id);
                      toast.info(`${m.name} marked absent`);
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {currentRecords.filter((r) => r.status === "present").length} manually marked present
        </p>
      </CardContent>
    </Card>
  );
}
