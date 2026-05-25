"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, UserPlus, ArrowRightLeft, Check, X, RefreshCw, Zap } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAttendance } from "@/lib/hooks/useAttendance";
import { useMembersStore } from "@/lib/store/membersStore";
import type { Visitor } from "@/types";
import { formatRelative } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const convertSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  gender: z.enum(["male", "female"]),
  ageGroup: z.enum(["child", "youth", "adult", "senior"]),
  group: z.string().optional(),
});
type ConvertForm = z.infer<typeof convertSchema>;

const STATUS_LABELS: Record<Visitor["status"], { label: string; color: "outline" | "warning" | "success" | "info" }> = {
  pending:   { label: "En attente", color: "warning" },
  recurring: { label: "Récurrent",  color: "info" },
  converted: { label: "Converti",   color: "success" },
};

const AGE_LABELS: Record<string, string> = { child: "Enfant", youth: "Jeune", adult: "Adulte", senior: "Senior" };
const GENDER_LABELS: Record<string, string> = { male: "H", female: "F" };

export function VisitorTracker() {
  const { currentVisitors, allVisitors, updateVisitor, convertVisitorToMember, currentSession } = useAttendance();
  const { addMember } = useMembersStore();
  const [convertingVisitor, setConvertingVisitor] = useState<Visitor | null>(null);
  const [tab, setTab] = useState<"live" | "all">("live");

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ConvertForm>({
    resolver: zodResolver(convertSchema),
    defaultValues: { gender: "male", ageGroup: "adult" },
  });

  const displayVisitors = tab === "live" ? currentVisitors : allVisitors;
  const pending   = displayVisitors.filter((v) => v.status === "pending").length;
  const recurring = displayVisitors.filter((v) => v.status === "recurring").length;
  const converted = displayVisitors.filter((v) => v.status === "converted").length;

  const openConvert = (v: Visitor) => {
    setConvertingVisitor(v);
    reset({
      gender: v.gender,
      ageGroup: v.ageGroup,
      name: v.tempName ?? "",
      email: "",
    });
  };

  const onConvertSubmit = (data: ConvertForm) => {
    if (!convertingVisitor) return;
    const newId = `m-conv-${Date.now()}`;
    addMember({
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      ageGroup: data.ageGroup,
      status: "active",
      joinedAt: new Date().toISOString().split("T")[0],
      group: data.group,
    });
    convertVisitorToMember(convertingVisitor.id, newId);
    toast.success(`${data.name} a été ajouté comme nouveau membre !`);
    setConvertingVisitor(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-semibold">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              Visiteurs inconnus
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setTab("live")}
                className={cn("text-xs px-2 py-0.5 rounded-md transition-colors", tab === "live" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}
              >
                Session ({currentVisitors.length})
              </button>
              <button
                onClick={() => setTab("all")}
                className={cn("text-xs px-2 py-0.5 rounded-md transition-colors", tab === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}
              >
                Tous ({allVisitors.length})
              </button>
            </div>
          </CardTitle>

          {/* Mini stats */}
          <div className="flex gap-3 mt-1">
            <span className="text-xs text-amber-600 dark:text-amber-400"><strong>{pending}</strong> en attente</span>
            <span className="text-xs text-blue-500"><strong>{recurring}</strong> récurrents</span>
            <span className="text-xs text-emerald-500"><strong>{converted}</strong> convertis</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {!currentSession && tab === "live" ? (
            <p className="text-xs text-muted-foreground text-center py-8">Démarrez une session pour voir les visiteurs.</p>
          ) : displayVisitors.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">Aucun visiteur détecté pour l'instant.</p>
          ) : (
            <div className="divide-y divide-border/40 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {displayVisitors.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/30 transition-colors"
                  >
                    {/* Avatar placeholder */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                      v.gender === "female" ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30" : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30"
                    )}>
                      {GENDER_LABELS[v.gender]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold truncate">
                          {v.tempName ?? `Inconnu ${v.gender === "female" ? "F" : "H"}-${v.id.slice(-3).toUpperCase()}`}
                        </p>
                        <Badge variant={STATUS_LABELS[v.status].color} className="text-[9px] px-1.5 py-0">
                          {STATUS_LABELS[v.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground capitalize">{AGE_LABELS[v.ageGroup]}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5 text-amber-400" />
                          {Math.round(v.confidence * 100)}%
                        </span>
                        <span className="text-[10px] text-muted-foreground">{formatRelative(v.detectedAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      {v.status !== "converted" && (
                        <>
                          <Button
                            size="icon" variant="ghost"
                            className="h-6 w-6 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                            onClick={() => { updateVisitor(v.id, { status: "recurring" }); toast.info("Marqué comme récurrent"); }}
                            title="Marquer récurrent"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon" variant="ghost"
                            className="h-6 w-6 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
                            onClick={() => openConvert(v)}
                            title="Convertir en membre"
                          >
                            <UserPlus className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                      {v.status === "converted" && (
                        <span className="flex items-center text-[10px] text-emerald-500 gap-1">
                          <ArrowRightLeft className="w-3 h-3" />Membre
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Conversion rate bar */}
          {displayVisitors.length > 0 && (
            <div className="px-4 py-3 border-t border-border/40">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Taux de conversion</span>
                <span className="font-semibold text-emerald-600">
                  {displayVisitors.length > 0 ? Math.round((converted / displayVisitors.length) * 100) : 0}%
                </span>
              </div>
              <Progress
                value={displayVisitors.length > 0 ? (converted / displayVisitors.length) * 100 : 0}
                className="h-1.5 [&>div]:bg-emerald-500"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Convert Dialog */}
      <Dialog open={!!convertingVisitor} onOpenChange={(o) => !o && setConvertingVisitor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convertir visiteur en membre</DialogTitle>
            <DialogDescription>
              Ce visiteur sera enregistré dans le registre de l'église.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onConvertSubmit)} className="space-y-3 mt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Nom complet *</Label>
                <Input {...register("name")} placeholder="Jean Kouassi" className="h-8 text-sm" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email *</Label>
                <Input {...register("email")} type="email" placeholder="email@exemple.com" className="h-8 text-sm" />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Téléphone</Label>
                <Input {...register("phone")} placeholder="+33 6 00 00 00 00" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Genre</Label>
                <Select value={watch("gender")} onValueChange={(v) => setValue("gender", v as any)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Groupe d'âge</Label>
                <Select value={watch("ageGroup")} onValueChange={(v) => setValue("ageGroup", v as any)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Enfant</SelectItem>
                    <SelectItem value="youth">Jeune</SelectItem>
                    <SelectItem value="adult">Adulte</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Groupe / Ministère</Label>
                <Input {...register("group")} placeholder="ex: Chorale, Jeunesse…" className="h-8 text-sm" />
              </div>
            </div>
            <DialogFooter className="pt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => setConvertingVisitor(null)}>Annuler</Button>
              <Button type="submit" size="sm">
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />Enregistrer comme membre
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
