"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Member } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  gender: z.enum(["male", "female"]),
  ageGroup: z.enum(["child", "youth", "adult", "senior"]),
  status: z.enum(["active", "inactive"]),
  group: z.string().optional(),
  notes: z.string().optional(),
  joinedAt: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  member?: Member | null;
  onSave: (data: FormValues) => Promise<void>;
  isSaving?: boolean;
}

export function MemberModal({ open, onClose, member, onSave, isSaving }: Props) {
  const isEdit = !!member;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "male",
      ageGroup: "adult",
      status: "active",
      joinedAt: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        email: member.email,
        phone: member.phone ?? "",
        gender: member.gender,
        ageGroup: member.ageGroup,
        status: member.status,
        group: member.group ?? "",
        notes: member.notes ?? "",
        joinedAt: member.joinedAt,
      });
    } else {
      reset({
        gender: "male",
        ageGroup: "adult",
        status: "active",
        joinedAt: new Date().toISOString().split("T")[0],
      });
    }
  }, [member, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await onSave(data);
      toast.success(isEdit ? "Member updated successfully" : "Member added successfully");
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Member" : "Add New Member"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update member information." : "Fill in the details to add a new church member."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Full Name *</Label>
              <Input {...register("name")} placeholder="James Okafor" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input {...register("email")} type="email" placeholder="member@church.org" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...register("phone")} placeholder="+1-555-0100" />
            </div>

            <div className="space-y-1.5">
              <Label>Gender *</Label>
              <Select value={watch("gender")} onValueChange={(v) => setValue("gender", v as "male" | "female")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Age Group *</Label>
              <Select value={watch("ageGroup")} onValueChange={(v) => setValue("ageGroup", v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="youth">Youth</SelectItem>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Status *</Label>
              <Select value={watch("status")} onValueChange={(v) => setValue("status", v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Group / Ministry</Label>
              <Input {...register("group")} placeholder="e.g. Choir, Ushers" />
            </div>

            <div className="space-y-1.5">
              <Label>Joined At *</Label>
              <Input {...register("joinedAt")} type="date" />
              {errors.joinedAt && <p className="text-xs text-destructive">{errors.joinedAt.message}</p>}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Input {...register("notes")} placeholder="Optional notes about this member..." />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
