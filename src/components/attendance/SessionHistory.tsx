"use client";

import { motion } from "framer-motion";
import { CalendarDays, Users, Cpu, Edit3, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAttendance } from "@/lib/hooks/useAttendance";
import { formatDate, formatPercent } from "@/lib/utils/format";
import { toast } from "sonner";

export function SessionHistory() {
  const { sessions } = useAttendance();
  const completed = sessions.filter((s) => s.status === "completed");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="w-4 h-4 text-primary" />
          Session History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {completed.map((session, i) => {
            const rate = session.totalMembers > 0 ? (session.totalPresent / session.totalMembers) * 100 : 0;
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-border/60 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{session.title}</p>
                      <Badge variant="outline" className="capitalize text-[10px]">{session.type}</Badge>
                      <Badge
                        variant={session.detectedBy === "ai" ? "purple" : session.detectedBy === "manual" ? "warning" : "info"}
                        className="text-[10px]"
                      >
                        {session.detectedBy === "ai" ? (
                          <><Cpu className="w-2.5 h-2.5 mr-1" />AI</>
                        ) : session.detectedBy === "manual" ? "Manual" : "Mixed"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(session.date, "EEEE, MMM d, yyyy")}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                    onClick={() => toast.info("Export feature — session report CSV")}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Present</p>
                    <p className="font-bold text-lg">{session.totalPresent}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Men</p>
                    <p className="font-semibold">{session.maleCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Women</p>
                    <p className="font-semibold">{session.femaleCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Children</p>
                    <p className="font-semibold">{session.childCount}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Attendance Rate</span>
                    <span className={`text-xs font-semibold ${rate >= 80 ? "text-emerald-500" : rate >= 60 ? "text-amber-500" : "text-red-500"}`}>
                      {formatPercent(rate)}
                    </span>
                  </div>
                  <Progress value={rate} className="h-1.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
