"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Save, Loader2, Plus, Pencil, Trash2, GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import type { Interest } from "@/types/database.types";

// ─── Dynamic Icon Picker ─────────────────────────────────────────────────────
const IconPicker = dynamic(
  () => import("@/components/ui/icon-picker-optimized").then((mod) => mod.IconPicker),
  {
    ssr: false,
    loading: () => <div className="text-sm text-stone-500">Loading icons…</div>,
  }
);

// ─── NES shadow tokens ────────────────────────────────────────────────────────
const nesRaised  = "inset -3px -3px 0px #6b6b6b, inset 3px 3px 0px #e0d8cc";
const nesPressed = "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc";

// ─── Color palette for interest badges ─────────────────────────────────────
const INTEREST_COLORS = [
  { name: "Amber",  value: "amber",  class: "bg-amber-100 text-amber-900 border-amber-300" },
  { name: "Blue",   value: "blue",   class: "bg-blue-100 text-blue-900 border-blue-300" },
  { name: "Green",  value: "green",  class: "bg-green-100 text-green-900 border-green-300" },
  { name: "Purple", value: "purple", class: "bg-purple-100 text-purple-900 border-purple-300" },
  { name: "Pink",   value: "pink",   class: "bg-pink-100 text-pink-900 border-pink-300" },
  { name: "Cyan",   value: "cyan",   class: "bg-cyan-100 text-cyan-900 border-cyan-300" },
  { name: "Orange", value: "orange", class: "bg-orange-100 text-orange-900 border-orange-300" },
  { name: "Lime",   value: "lime",   class: "bg-lime-100 text-lime-900 border-lime-300" },
  { name: "Rose",   value: "rose",   class: "bg-rose-100 text-rose-900 border-rose-300" },
];

// ─── Reusable NES-style input wrapper ─────────────────────────────────────────
const nesInputCls =
  "w-full px-3 py-2.5 text-base font-medium text-stone-900 bg-stone-50 " +
  "border-2 border-stone-900 rounded focus:outline-none focus:border-amber-600 " +
  "placeholder:text-stone-400 font-[family-name:var(--font-space)]";

// ─── Field label ──────────────────────────────────────────────────────────────
function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-black text-stone-800 mb-1 font-[family-name:var(--font-space-mono)]"
    >
      {children}
    </label>
  );
}

// ─── NES section box ──────────────────────────────────────────────────────────
function NesBox({
  headerColor,
  headerContent,
  children,
  bgColor = "bg-stone-100",
}: {
  headerColor: string;
  headerContent: React.ReactNode;
  children: React.ReactNode;
  bgColor?: string;
}) {
  return (
    <div
      className={`border-2 border-stone-900 rounded ${bgColor}`}
      style={{ boxShadow: nesRaised }}
    >
      <div
        className={`${headerColor} px-3 py-2 border-b-2 border-stone-900 rounded-t flex items-center gap-2`}
      >
        {headerContent}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function InterestsAdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Interest> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ─── Fetch interests on mount ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchInterests() {
      try {
        const { data, error } = await supabase
          .from("interests")
          .select("*")
          .order("order_index", { ascending: true });
        if (error) throw error;
        setInterests(data || []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load interests");
      } finally {
        setIsLoading(false);
      }
    }
    fetchInterests();
  }, [supabase]);

  // ─── Save interest (insert or update) ─────────────────────────────────────
  const handleSave = async () => {
    if (!editingItem?.name?.trim()) {
      toast.error("Interest name is required");
      return;
    }
    setIsSaving(true);
    try {
      if (editingItem.id) {
        const { error } = await supabase
          .from("interests")
          .update({
            name: editingItem.name,
            icon: editingItem.icon || null,
            color: editingItem.color || null,
            description: editingItem.description || null,
            order_index: editingItem.order_index ?? 0,
          })
          .eq("id", editingItem.id);
        if (error) throw error;
        setInterests(prev =>
          prev.map(i =>
            i.id === editingItem.id
              ? { ...i, ...editingItem, order_index: editingItem.order_index ?? 0 }
              : i
          )
        );
        toast.success("Interest updated!");
      } else {
        const newOrder =
          interests.length > 0 ? Math.max(...interests.map(i => i.order_index)) + 1 : 0;
        const { data, error } = await supabase
          .from("interests")
          .insert([
            {
              name: editingItem.name,
              icon: editingItem.icon || null,
              color: editingItem.color || null,
              description: editingItem.description || null,
              order_index: editingItem.order_index ?? newOrder,
            },
          ])
          .select()
          .single();
        if (error) throw error;
        if (data) setInterests(prev => [...prev, data]);
        toast.success("Interest added!");
      }
      setEditingItem(null);
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete interest ─────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("interests").delete().eq("id", deleteId);
      if (error) throw error;
      setInterests(prev => prev.filter(i => i.id !== deleteId));
      toast.success("Interest deleted!");
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  // ─── Get color class for badge preview ────────────────────────────────────
  const getColorClass = (colorValue?: string | null) => {
    const found = INTEREST_COLORS.find(c => c.value === colorValue);
    return found?.class || "bg-stone-100 text-stone-900 border-stone-300";
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="admin-shell min-h-screen bg-stone-50 p-4 sm:p-6">
        <AdminHeader title="Interests" />
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <div
            className="flex items-center justify-center h-14 w-14 bg-amber-100 border-2 border-stone-900 rounded"
            style={{ boxShadow: nesRaised }}
          >
            <Loader2 className="h-7 w-7 animate-spin text-stone-700" />
          </div>
          <p className="text-sm font-black text-stone-600 font-[family-name:var(--font-space-mono)]">
            Loading interests…
          </p>
        </div>
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="admin-shell min-h-screen bg-stone-50 p-4 sm:p-6">
      <AdminHeader title="Interests" />

      {/* Add Button */}
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="admin-btn bg-amber-400 text-stone-900 font-black flex items-center gap-2"
              onClick={() => {
                setEditingItem({
                  name: "",
                  icon: null,
                  color: null,
                  description: null,
                  order_index: interests.length,
                });
              }}
            >
              <Plus className="h-5 w-5" />
              Add Interest
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-space-mono)]">
                {editingItem?.id ? "Edit Interest" : "Add Interest"}
              </DialogTitle>
            </DialogHeader>

            {/* Form Content */}
            <div className="space-y-4 py-2">
              {/* Name */}
              <div>
                <FieldLabel htmlFor="name">Interest Name *</FieldLabel>
                <input
                  id="name"
                  type="text"
                  className={nesInputCls}
                  style={{ boxShadow: nesPressed }}
                  value={editingItem?.name || ""}
                  onChange={e =>
                    setEditingItem(p => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g: Urban Planning, Photography"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <FieldLabel>Icon (Lucide)</FieldLabel>
                <div className="border-2 border-stone-900 rounded p-3 bg-stone-50">
                  <IconPicker
                    value={editingItem?.icon || ""}
                    onChange={icon => setEditingItem(p => ({ ...p, icon }))}
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <FieldLabel>Color</FieldLabel>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {INTEREST_COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() =>
                        setEditingItem(p => ({ ...p, color: color.value }))
                      }
                      className={`px-2 py-1.5 text-xs font-bold border-2 rounded text-center transition-all ${
                        editingItem?.color === color.value
                          ? "border-stone-900 scale-105"
                          : "border-stone-300"
                      } ${color.class}`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <textarea
                  id="description"
                  className={`${nesInputCls} resize-none`}
                  style={{ boxShadow: nesPressed }}
                  rows={3}
                  value={editingItem?.description || ""}
                  onChange={e =>
                    setEditingItem(p => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Brief description of this interest"
                />
              </div>

              {/* Order Index */}
              <div>
                <FieldLabel htmlFor="order_index">Display Order</FieldLabel>
                <input
                  id="order_index"
                  type="number"
                  className={nesInputCls}
                  style={{ boxShadow: nesPressed }}
                  value={editingItem?.order_index ?? ""}
                  onChange={e =>
                    setEditingItem(p => ({
                      ...p,
                      order_index: e.target.value ? Number(e.target.value) : 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>

              {/* Preview */}
              {editingItem?.name && (
                <div className="pt-2">
                  <FieldLabel>Preview</FieldLabel>
                  <div className={`inline-block px-3 py-1.5 rounded-full border-2 ${getColorClass(editingItem.color)}`}>
                    <span className="text-sm font-bold">{editingItem.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-amber-400 text-stone-900 font-bold hover:bg-amber-500"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Interests List */}
      {interests.length === 0 ? (
        <NesBox headerColor="bg-stone-400" headerContent={<span className="font-black">No Interests Yet</span>}>
          <p className="text-sm text-stone-600">Add your first interest to get started!</p>
        </NesBox>
      ) : (
        <div className="space-y-3">
          {interests.map(interest => (
            <NesBox
              key={interest.id}
              headerColor="bg-stone-300"
              headerContent={
                <div className="flex items-center gap-3 w-full">
                  <GripVertical className="h-5 w-5 text-stone-600" />
                  <span className="text-sm font-bold text-stone-900 flex-1">{interest.name}</span>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="admin-btn bg-blue-400 text-stone-900 p-2 h-8 w-8"
                          onClick={() => setEditingItem(interest)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-[family-name:var(--font-space-mono)]">
                            Edit Interest
                          </DialogTitle>
                        </DialogHeader>

                        {/* Edit Form */}
                        <div className="space-y-4 py-2">
                          {/* Name */}
                          <div>
                            <FieldLabel htmlFor="edit-name">Interest Name *</FieldLabel>
                            <input
                              id="edit-name"
                              type="text"
                              className={nesInputCls}
                              style={{ boxShadow: nesPressed }}
                              value={editingItem?.name || ""}
                              onChange={e =>
                                setEditingItem(p => ({ ...p, name: e.target.value }))
                              }
                              placeholder="e.g: Urban Planning"
                            />
                          </div>

                          {/* Icon Picker */}
                          <div>
                            <FieldLabel>Icon (Lucide)</FieldLabel>
                            <div className="border-2 border-stone-900 rounded p-3 bg-stone-50">
                              <IconPicker
                                value={editingItem?.icon || ""}
                                onChange={icon =>
                                  setEditingItem(p => ({ ...p, icon }))
                                }
                              />
                            </div>
                          </div>

                          {/* Color Picker */}
                          <div>
                            <FieldLabel>Color</FieldLabel>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {INTEREST_COLORS.map(color => (
                                <button
                                  key={color.value}
                                  onClick={() =>
                                    setEditingItem(p => ({
                                      ...p,
                                      color: color.value,
                                    }))
                                  }
                                  className={`px-2 py-1.5 text-xs font-bold border-2 rounded text-center transition-all ${
                                    editingItem?.color === color.value
                                      ? "border-stone-900 scale-105"
                                      : "border-stone-300"
                                  } ${color.class}`}
                                >
                                  {color.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <FieldLabel htmlFor="edit-description">Description</FieldLabel>
                            <textarea
                              id="edit-description"
                              className={`${nesInputCls} resize-none`}
                              style={{ boxShadow: nesPressed }}
                              rows={3}
                              value={editingItem?.description || ""}
                              onChange={e =>
                                setEditingItem(p => ({
                                  ...p,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Brief description"
                            />
                          </div>

                          {/* Order Index */}
                          <div>
                            <FieldLabel htmlFor="edit-order">Display Order</FieldLabel>
                            <input
                              id="edit-order"
                              type="number"
                              className={nesInputCls}
                              style={{ boxShadow: nesPressed }}
                              value={editingItem?.order_index ?? ""}
                              onChange={e =>
                                setEditingItem(p => ({
                                  ...p,
                                  order_index: e.target.value
                                    ? Number(e.target.value)
                                    : 0,
                                }))
                              }
                            />
                          </div>

                          {/* Preview */}
                          {editingItem?.name && (
                            <div className="pt-2">
                              <FieldLabel>Preview</FieldLabel>
                              <div
                                className={`inline-block px-3 py-1.5 rounded-full border-2 ${getColorClass(
                                  editingItem.color
                                )}`}
                              >
                                <span className="text-sm font-bold">
                                  {editingItem.name}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Dialog Footer */}
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setEditingItem(null)}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-amber-400 text-stone-900 font-bold hover:bg-amber-500"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving…
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog open={deleteId === interest.id} onOpenChange={open => !open && setDeleteId(null)}>
                      <button
                        className="admin-btn bg-red-400 text-white p-2 h-8 w-8"
                        onClick={() => setDeleteId(interest.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Interest?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{interest.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              }
            >
              <div className="space-y-2">
                {interest.icon && (
                  <p className="text-xs text-stone-600">
                    <span className="font-bold">Icon:</span> {interest.icon}
                  </p>
                )}
                {interest.color && (
                  <p className="text-xs text-stone-600">
                    <span className="font-bold">Color:</span> {interest.color}
                  </p>
                )}
                {interest.description && (
                  <p className="text-sm text-stone-700">{interest.description}</p>
                )}
                <p className="text-xs text-stone-500">
                  <span className="font-bold">Order:</span> {interest.order_index}
                </p>
              </div>
            </NesBox>
          ))}
        </div>
      )}
    </div>
  );
}
