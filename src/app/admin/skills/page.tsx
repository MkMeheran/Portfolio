"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Save, Loader2, Plus, Pencil, Trash2, Eye, Award,
  ChevronDown, ExternalLink, GripVertical, Wrench,
} from "lucide-react";
import { toast } from "sonner";
import type { Skill, Certificate } from "@/types/database.types";

// ─── dynamic imports (unchanged) ─────────────────────────────────────────────
const ImageUploader = dynamic(
  () => import("@/components/admin/image-uploader").then((mod) => mod.ImageUploader),
  {
    ssr: false,
    loading: () => <div className="text-sm text-stone-500">Loading uploader…</div>,
  }
);
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
const nesDanger  = "inset -3px -3px 0px #7f0000, inset 3px 3px 0px #ff8080";

// ─── Warm colour palette for skill cards (cycles) ────────────────────────────
const CARD_COLORS = [
  { bg: "bg-amber-100",   header: "bg-amber-400",   text: "text-amber-900"   },
  { bg: "bg-orange-100",  header: "bg-orange-400",  text: "text-orange-900"  },
  { bg: "bg-lime-100",    header: "bg-lime-400",     text: "text-lime-900"    },
  { bg: "bg-fuchsia-100", header: "bg-fuchsia-400", text: "text-fuchsia-900" },
  { bg: "bg-cyan-100",    header: "bg-cyan-400",    text: "text-cyan-900"    },
  { bg: "bg-rose-100",    header: "bg-rose-400",    text: "text-rose-900"    },
  { bg: "bg-violet-100",  header: "bg-violet-400",  text: "text-violet-900"  },
  { bg: "bg-teal-100",    header: "bg-teal-400",    text: "text-teal-900"    },
];

// ─── Background Color picker data (unchanged values, updated preview classes) ─
const BG_COLORS = [
  { name: "Amber",  class: "bg-amber-300",   value: "amber"  },
  { name: "Blue",   class: "bg-blue-300",    value: "blue"   },
  { name: "Green",  class: "bg-green-300",   value: "green"  },
  { name: "Purple", class: "bg-purple-300",  value: "purple" },
  { name: "Pink",   class: "bg-pink-300",    value: "pink"   },
  { name: "Cyan",   class: "bg-cyan-300",    value: "cyan"   },
  { name: "Orange", class: "bg-orange-300",  value: "orange" },
  { name: "Lime",   class: "bg-lime-300",    value: "lime"   },
  { name: "Rose",   class: "bg-rose-300",    value: "rose"   },
  { name: "Slate",  class: "bg-slate-300",   value: "slate"  },
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
export default function SkillsAdminPage() {
  // ── ALL STATE / LOGIC BELOW IS UNCHANGED ─────────────────────────────────
  const PAGE_SIZE = 20;
  const router = useRouter();
  const supabase = createClient();

  const [isLoading,      setIsLoading]      = useState(true);
  const [isSaving,       setIsSaving]       = useState(false);
  const [skills,         setSkills]         = useState<(Skill & { certificates?: Certificate[] })[]>([]);
  const [page,           setPage]           = useState(1);
  const [hasMore,        setHasMore]        = useState(true);
  const [editingItem,    setEditingItem]    = useState<Partial<Skill> | null>(null);
  const [editingCert,    setEditingCert]    = useState<Partial<Certificate> & { skill_id?: string } | null>(null);
  const [deleteId,       setDeleteId]       = useState<string | null>(null);
  const [deleteCertId,   setDeleteCertId]   = useState<string | null>(null);
  const [showPreview,    setShowPreview]    = useState(false);
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchSkills() {
      const { data } = await supabase
        .from("skills")
        .select(`*, certificates (*)`)
        .order("display_order", { ascending: true })
        .range(0, page * PAGE_SIZE - 1);
      if (data) { setSkills(data); setHasMore(data.length >= page * PAGE_SIZE); }
      setIsLoading(false);
    }
    fetchSkills();
  }, [supabase, page]);

  const handleSaveSkill = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    try {
      if (editingItem.id) {
        const { error } = await supabase.from("skills").update({ ...editingItem, updated_at: new Date().toISOString() }).eq("id", editingItem.id);
        if (error) throw error;
        setSkills(prev => prev.map(s => s.id === editingItem.id ? { ...s, ...editingItem } as typeof s : s));
      } else {
        const newOrder = skills.length > 0 ? Math.max(...skills.map(s => s.display_order)) + 1 : 0;
        const { data, error } = await supabase.from("skills").insert([{ ...editingItem, display_order: newOrder }]).select().single();
        if (error) throw error;
        if (data) setSkills(prev => [...prev, { ...data, certificates: [] }]);
      }
      toast.success(editingItem.id ? "Updated!" : "Added!");
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally { setIsSaving(false); }
  };

  const handleSaveCertificate = async () => {
    if (!editingCert || !editingCert.skill_id) return;
    setIsSaving(true);
    try {
      if (editingCert.id) {
        const { error } = await supabase.from("certificates").update({ ...editingCert, updated_at: new Date().toISOString() }).eq("id", editingCert.id);
        if (error) throw error;
        setSkills(prev => prev.map(s => s.id === editingCert.skill_id
          ? { ...s, certificates: s.certificates?.map(c => c.id === editingCert.id ? { ...c, ...editingCert } as Certificate : c) }
          : s));
      } else {
        const skill = skills.find(s => s.id === editingCert.skill_id);
        const newOrder = skill?.certificates?.length ? Math.max(...skill.certificates.map(c => c.display_order)) + 1 : 0;
        const { data, error } = await supabase.from("certificates").insert([{ ...editingCert, display_order: newOrder }]).select().single();
        if (error) throw error;
        if (data) setSkills(prev => prev.map(s => s.id === editingCert.skill_id ? { ...s, certificates: [...(s.certificates || []), data] } : s));
      }
      toast.success(editingCert.id ? "Certificate updated!" : "Certificate added!");
      setEditingCert(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally { setIsSaving(false); }
  };

  const handleDeleteSkill = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("skills").delete().eq("id", deleteId);
      if (error) throw error;
      setSkills(prev => prev.filter(s => s.id !== deleteId));
      toast.success("Deleted!"); setDeleteId(null);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Failed to delete"); }
  };

  const handleDeleteCertificate = async () => {
    if (!deleteCertId) return;
    try {
      const { error } = await supabase.from("certificates").delete().eq("id", deleteCertId);
      if (error) throw error;
      setSkills(prev => prev.map(s => ({ ...s, certificates: s.certificates?.filter(c => c.id !== deleteCertId) })));
      toast.success("Certificate deleted!"); setDeleteCertId(null);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Failed to delete"); }
  };

  const toggleSkillExpanded = (skillId: string) => {
    setExpandedSkills(prev => {
      const newSet = new Set(prev);
      newSet.has(skillId) ? newSet.delete(skillId) : newSet.add(skillId);
      return newSet;
    });
  };
  // ── END UNCHANGED LOGIC ───────────────────────────────────────────────────

  // ── Loading screen ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div
          className="flex items-center justify-center h-14 w-14 bg-amber-100 border-2 border-stone-900 rounded"
          style={{ boxShadow: nesRaised }}
        >
          <Loader2 className="h-7 w-7 animate-spin text-stone-700" />
        </div>
        <p className="text-sm font-black text-stone-600 font-[family-name:var(--font-space-mono)]">Loading skills…</p>
      </div>
    );
  }

  // ─────────────────────── SKILL FORM (inside Dialog) ──────────────────────
  const skillFormContent = (
    <div className="space-y-4 py-2">
      {/* Name + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="name">Skill Name *</FieldLabel>
          <input id="name" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingItem?.name || ""}
            onChange={e => setEditingItem(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g: GIS & Remote Sensing" />
        </div>
        <div>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <input id="category" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingItem?.category || ""}
            onChange={e => setEditingItem(p => ({ ...p, category: e.target.value }))}
            placeholder="e.g: Technical" />
        </div>
      </div>

      {/* Icon */}
      <div>
        <FieldLabel htmlFor="icon">Icon (Lucide)</FieldLabel>
        <IconPicker
          value={editingItem?.icon || ""}
          onChange={value => setEditingItem(p => ({ ...p, icon: value }))}
          placeholder="Select an icon…"
        />
      </div>

      {/* Background Color */}
      <div>
        <FieldLabel>Background Color</FieldLabel>
        <div className="flex flex-wrap gap-2 mt-1">
          {BG_COLORS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => setEditingItem(p => ({ ...p, bg_color: color.value }))}
              className={`h-9 w-9 rounded ${color.class} border-2 transition-all`}
              style={{
                borderColor: editingItem?.bg_color === color.value ? "#1c1917" : "#a8a29e",
                boxShadow: editingItem?.bg_color === color.value ? nesRaised : "none",
                transform: editingItem?.bg_color === color.value ? "scale(1.15)" : "scale(1)",
              }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Sub-Skills */}
      <div>
        <FieldLabel htmlFor="sub_skills">Sub-Skills (comma separated)</FieldLabel>
        <input id="sub_skills" className={nesInputCls} style={{ boxShadow: nesPressed }}
          value={editingItem?.sub_skills?.join(", ") || ""}
          onChange={e => setEditingItem(p => ({
            ...p,
            sub_skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
          }))}
          placeholder="ArcGIS, QGIS, Python" />
      </div>

      {/* Description */}
      <div>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <textarea id="description" rows={3}
          className={nesInputCls} style={{ boxShadow: nesPressed }}
          value={editingItem?.description || ""}
          onChange={e => setEditingItem(p => ({ ...p, description: e.target.value }))}
          placeholder="Detailed information about this skill…" />
      </div>

      {/* Has Certificates toggle */}
      <div
        className="flex items-center gap-3 px-3 py-2.5 bg-amber-50 border-2 border-stone-900 rounded"
        style={{ boxShadow: nesRaised }}
      >
        <Switch
          id="has_certificates"
          checked={editingItem?.has_certificates || false}
          onCheckedChange={checked => setEditingItem(p => ({ ...p, has_certificates: checked }))}
        />
        <label htmlFor="has_certificates"
          className="text-base font-black text-stone-800 font-[family-name:var(--font-space-mono)] cursor-pointer">
          Has Certificates
        </label>
      </div>
    </div>
  );

  // ─────────────────────── CERT FORM ───────────────────────────────────────
  const certFormContent = (
    <div className="space-y-4 py-2">
      <div>
        <FieldLabel htmlFor="cert_title">Certificate Name *</FieldLabel>
        <input id="cert_title" className={nesInputCls} style={{ boxShadow: nesPressed }}
          value={editingCert?.title || ""}
          onChange={e => setEditingCert(p => ({ ...p, title: e.target.value }))}
          placeholder="e.g: Google Data Analytics" />
      </div>
      <div>
        <FieldLabel htmlFor="cert_issuer">Issuing Organization</FieldLabel>
        <input id="cert_issuer" className={nesInputCls} style={{ boxShadow: nesPressed }}
          value={editingCert?.issuer || ""}
          onChange={e => setEditingCert(p => ({ ...p, issuer: e.target.value }))}
          placeholder="e.g: Google, Coursera" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="cert_credential_id">Credential ID</FieldLabel>
          <input id="cert_credential_id" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingCert?.credential_id || ""}
            onChange={e => setEditingCert(p => ({ ...p, credential_id: e.target.value }))}
            placeholder="ABC123XYZ" />
        </div>
        <div>
          <FieldLabel htmlFor="cert_credential_url">Credential URL</FieldLabel>
          <input id="cert_credential_url" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingCert?.credential_url || ""}
            onChange={e => setEditingCert(p => ({ ...p, credential_url: e.target.value }))}
            placeholder="https://credential.link" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="cert_issue_date">Issue Date</FieldLabel>
          <input id="cert_issue_date" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingCert?.issue_date || ""}
            onChange={e => setEditingCert(p => ({ ...p, issue_date: e.target.value }))}
            placeholder="Jan 2024" />
        </div>
        <div>
          <FieldLabel htmlFor="cert_expiry_date">Expiry Date</FieldLabel>
          <input id="cert_expiry_date" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingCert?.expiry_date || ""}
            onChange={e => setEditingCert(p => ({ ...p, expiry_date: e.target.value }))}
            placeholder="Jan 2027 or leave empty" />
        </div>
      </div>
      <div>
        <FieldLabel>Certificate Image</FieldLabel>
        <ImageUploader
          value={editingCert?.image_url || ""}
          onChange={url => setEditingCert(p => ({ ...p, image_url: url }))}
          preset="certificate"
          folder="certificates"
          alt={editingCert?.image_alt || ""}
          onAltChange={alt => setEditingCert(p => ({ ...p, image_alt: alt }))}
        />
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    // Page wrapper — warm brown bg, no NES shadow on this outermost div
    <div className="min-h-screen bg-stone-300 pb-8">
      <div className="max-w-2xl mx-auto px-2 sm:px-4 pt-4 space-y-4">

        {/* ── Page header ── */}
        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
                     bg-amber-200 border-2 border-stone-900 rounded px-3 py-3"
          style={{ boxShadow: nesRaised }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center h-11 w-11 bg-amber-400 border-2 border-stone-900 rounded shrink-0"
              style={{ boxShadow: nesRaised }}
            >
              <Wrench className="h-6 w-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900 font-[family-name:var(--font-space-mono)] leading-tight">
                Skills & Certificates
              </h1>
              <p className="text-sm font-medium text-stone-600 font-[family-name:var(--font-space)]">
                Manage your skills and certifications
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-2 bg-stone-100 text-stone-900
                         text-sm font-black border-2 border-stone-900 rounded
                         font-[family-name:var(--font-space-mono)]"
              style={{ boxShadow: nesRaised }}
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "List" : "Preview"}
            </button>

            {/* Add Skill dialog trigger */}
            <Dialog open={!!editingItem} onOpenChange={open => !open && setEditingItem(null)}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setEditingItem({})}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-400 text-stone-900
                             text-sm font-black border-2 border-stone-900 rounded
                             font-[family-name:var(--font-space-mono)]"
                  style={{ boxShadow: nesRaised }}
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </button>
              </DialogTrigger>

              <DialogContent
                className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto
                           bg-stone-100 border-2 border-stone-900 rounded p-0"
                style={{ boxShadow: nesRaised }}
              >
                {/* sr-only title for accessibility */}
                <DialogTitle className="sr-only">
                  {editingItem?.id ? "Edit Skill" : "Add New Skill"}
                </DialogTitle>
                {/* Dialog header strip */}
                <div className="bg-amber-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
                  <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                    {editingItem?.id ? "✏️ Edit Skill" : "➕ Add New Skill"}
                  </h2>
                </div>
                <div className="px-4 pb-4">{skillFormContent}</div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-4 pb-4">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 bg-stone-200 text-stone-900 text-sm font-black
                               border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
                    style={{ boxShadow: nesRaised }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSkill}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-stone-900
                               text-sm font-black border-2 border-stone-900 rounded
                               font-[family-name:var(--font-space-mono)] disabled:opacity-60"
                    style={{ boxShadow: nesRaised }}
                  >
                    {isSaving
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Save className="h-4 w-4" />}
                    Save
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Certificate Edit Dialog ── */}
        <Dialog open={!!editingCert} onOpenChange={open => !open && setEditingCert(null)}>
          <DialogContent
            className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto
                       bg-stone-100 border-2 border-stone-900 rounded p-0"
            style={{ boxShadow: nesRaised }}
          >
            {/* sr-only title for accessibility */}
            <DialogTitle className="sr-only">
              {editingCert?.id ? "Edit Certificate" : "Add Certificate"}
            </DialogTitle>
            <div className="bg-fuchsia-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
              <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                {editingCert?.id ? "✏️ Edit Certificate" : "➕ Add Certificate"}
              </h2>
            </div>
            <div className="px-4 pb-4">{certFormContent}</div>
            <div className="flex justify-end gap-2 px-4 pb-4">
              <button
                onClick={() => setEditingCert(null)}
                className="px-4 py-2 bg-stone-200 text-stone-900 text-sm font-black
                           border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
                style={{ boxShadow: nesRaised }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCertificate}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-stone-900
                           text-sm font-black border-2 border-stone-900 rounded
                           font-[family-name:var(--font-space-mono)] disabled:opacity-60"
                style={{ boxShadow: nesRaised }}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ════════════════════ PREVIEW MODE ════════════════════ */}
        {showPreview ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((skill, idx) => {
              const col = CARD_COLORS[idx % CARD_COLORS.length];
              return (
                <div
                  key={skill.id}
                  className={`border-2 border-stone-900 rounded ${col.bg}`}
                  style={{ boxShadow: nesRaised }}
                >
                  {/* Card header */}
                  <div className={`${col.header} px-3 py-2 border-b-2 border-stone-900 rounded-t flex items-center justify-between gap-2`}>
                    <span className="font-black text-base text-stone-900 font-[family-name:var(--font-space-mono)]">
                      {skill.name}
                    </span>
                    {skill.has_certificates && (
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 bg-stone-900 text-amber-300
                                   text-xs font-black rounded border border-stone-700 font-[family-name:var(--font-space-mono)]"
                      >
                        <Award className="h-3 w-3" />
                        {skill.certificates?.length}
                      </span>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    {skill.category && (
                      <p className="text-xs font-bold text-stone-600 font-[family-name:var(--font-space-mono)]">
                        {skill.category}
                      </p>
                    )}
                    {skill.sub_skills && skill.sub_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {skill.sub_skills.map((sub, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-stone-900 text-amber-200 text-xs font-bold
                                       border border-stone-700 rounded font-[family-name:var(--font-space-mono)]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                    {skill.certificates && skill.certificates.length > 0 && (
                      <div className="space-y-2 pt-2 border-t-2 border-stone-900">
                        {skill.certificates.map(cert => (
                          <div key={cert.id}>
                            <p className="text-sm font-bold text-stone-800">{cert.title}</p>
                            {cert.issuer && (
                              <p className="text-xs text-stone-600">{cert.issuer}</p>
                            )}
                            {cert.image_url && (
                              <img
                                src={cert.image_url}
                                alt={cert.image_alt || cert.title}
                                className="w-full mt-1 border-2 border-stone-900 rounded"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        ) : (
          /* ════════════════════ LIST MODE ════════════════════ */
          <div className="space-y-3">
            {skills.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-14 gap-3
                           bg-amber-50 border-2 border-stone-900 rounded"
                style={{ boxShadow: nesRaised }}
              >
                <div
                  className="flex items-center justify-center h-16 w-16 bg-amber-200
                             border-2 border-stone-900 rounded"
                  style={{ boxShadow: nesRaised }}
                >
                  <Award className="h-9 w-9 text-stone-600" />
                </div>
                <p className="text-base font-black text-stone-600 font-[family-name:var(--font-space-mono)]">
                  No skills yet
                </p>
                <button
                  onClick={() => setEditingItem({})}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-stone-900
                             text-sm font-black border-2 border-stone-900 rounded
                             font-[family-name:var(--font-space-mono)]"
                  style={{ boxShadow: nesRaised }}
                >
                  <Plus className="h-4 w-4" />
                  Add First Skill
                </button>
              </div>
            ) : (
              skills.map((skill, idx) => {
                const col = CARD_COLORS[idx % CARD_COLORS.length];
                const isExpanded = expandedSkills.has(skill.id);
                return (
                  <Collapsible
                    key={skill.id}
                    open={isExpanded}
                    onOpenChange={() => toggleSkillExpanded(skill.id)}
                  >
                    {/* Compact single-line card — colored left border accent only */}
                    <div
                      className="flex items-center gap-2 px-2 py-2.5 bg-stone-50
                                 border-2 border-stone-900 rounded overflow-hidden"
                      style={{
                        boxShadow: nesRaised,
                        borderLeft: `5px solid`,
                        borderLeftColor: col.header.replace("bg-", "").includes("amber")   ? "#fbbf24"
                          : col.header.replace("bg-", "").includes("orange")  ? "#fb923c"
                          : col.header.replace("bg-", "").includes("lime")    ? "#a3e635"
                          : col.header.replace("bg-", "").includes("fuchsia") ? "#e879f9"
                          : col.header.replace("bg-", "").includes("cyan")    ? "#22d3ee"
                          : col.header.replace("bg-", "").includes("rose")    ? "#fb7185"
                          : col.header.replace("bg-", "").includes("violet")  ? "#a78bfa"
                          : "#2dd4bf",
                      }}
                    >
                      {/* Drag handle */}
                      <GripVertical className="h-4 w-4 text-stone-400 shrink-0 cursor-move" />

                      {/* Skill name + cert count */}
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <span className="font-black text-sm text-stone-900 font-[family-name:var(--font-space-mono)] truncate">
                          {skill.name}
                        </span>
                        {skill.has_certificates && (
                          <span
                            className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-400 text-stone-900
                                       text-xs font-black rounded border border-stone-700
                                       font-[family-name:var(--font-space-mono)] shrink-0"
                          >
                            <Award className="h-3 w-3" />
                            {skill.certificates?.length}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1 shrink-0">
                        {skill.has_certificates && (
                          <CollapsibleTrigger asChild>
                            <button
                              className="flex items-center justify-center h-8 w-8 bg-stone-200
                                         border-2 border-stone-900 rounded"
                              style={{ boxShadow: nesRaised }}
                              title="View certificates"
                            >
                              <ChevronDown
                                className={`h-4 w-4 text-stone-700 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          </CollapsibleTrigger>
                        )}
                        <button
                          onClick={() => setEditingItem(skill)}
                          className="flex items-center justify-center h-8 w-8 bg-cyan-300
                                     border-2 border-stone-900 rounded"
                          style={{ boxShadow: nesRaised }}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 text-stone-900" />
                        </button>
                        <button
                          onClick={() => setDeleteId(skill.id)}
                          className="flex items-center justify-center h-8 w-8 bg-red-500
                                     border-2 border-stone-900 rounded"
                          style={{ boxShadow: nesDanger }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* ── Certificates panel ── */}
                    {skill.has_certificates && (
                      <CollapsibleContent>
                          <div className="border-t-2 border-stone-900 bg-stone-200 px-2 py-3 rounded-b space-y-2">
                            {/* Certs header */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-black text-stone-800 font-[family-name:var(--font-space-mono)]">
                                Certificates
                              </span>
                              <button
                                onClick={() => setEditingCert({ skill_id: skill.id })}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-400 text-stone-900
                                           text-xs font-black border-2 border-stone-900 rounded
                                           font-[family-name:var(--font-space-mono)]"
                                style={{ boxShadow: nesRaised }}
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add
                              </button>
                            </div>

                            {skill.certificates && skill.certificates.length > 0 ? (
                              skill.certificates.map(cert => (
                                <div
                                  key={cert.id}
                                  className="flex items-start gap-2 p-2.5 bg-stone-50 border-2 border-stone-900 rounded"
                                  style={{ boxShadow: nesRaised }}
                                >
                                  {cert.image_url && (
                                    <img
                                      src={cert.image_url}
                                      alt={cert.image_alt || cert.title}
                                      className="h-12 w-16 object-cover border-2 border-stone-900 rounded shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-black text-sm text-stone-900 truncate font-[family-name:var(--font-space-mono)]">
                                      {cert.title}
                                    </p>
                                    {cert.issuer && (
                                      <p className="text-xs font-medium text-stone-600">{cert.issuer}</p>
                                    )}
                                    {cert.credential_id && (
                                      <p className="text-xs text-stone-500">ID: {cert.credential_id}</p>
                                    )}
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    {cert.credential_url && (
                                      <a
                                        href={cert.credential_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center h-8 w-8 bg-lime-300
                                                   border-2 border-stone-900 rounded"
                                        style={{ boxShadow: nesRaised }}
                                      >
                                        <ExternalLink className="h-3.5 w-3.5 text-stone-900" />
                                      </a>
                                    )}
                                    <button
                                      onClick={() => setEditingCert({ ...cert, skill_id: skill.id })}
                                      className="flex items-center justify-center h-8 w-8 bg-cyan-300
                                                 border-2 border-stone-900 rounded"
                                      style={{ boxShadow: nesRaised }}
                                    >
                                      <Pencil className="h-3.5 w-3.5 text-stone-900" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteCertId(cert.id)}
                                      className="flex items-center justify-center h-8 w-8 bg-red-500
                                                 border-2 border-stone-900 rounded"
                                      style={{ boxShadow: nesDanger }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-white" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm font-medium text-stone-500 text-center py-3 font-[family-name:var(--font-space-mono)]">
                                No certificates yet
                              </p>
                            )}
                          </div>
                        </CollapsibleContent>
                    )}
                  </Collapsible>
                );
              })
            )}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-300 text-stone-900
                             text-sm font-black border-2 border-stone-900 rounded
                             font-[family-name:var(--font-space-mono)]"
                  style={{ boxShadow: nesRaised }}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Delete Skill Confirmation ─────────────────────────── */}
        <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent
            className="max-w-sm w-[92vw] bg-stone-100 border-2 border-stone-900 rounded p-0"
            style={{ boxShadow: nesRaised }}
          >
            <div className="bg-red-500 px-4 py-3 border-b-2 border-stone-900 rounded-t">
              <h2 className="text-base font-black text-white font-[family-name:var(--font-space-mono)]">
                ⚠️ Delete Skill?
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm font-medium text-stone-700 font-[family-name:var(--font-space)]">
                This skill and all its certificates will be permanently deleted. This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-stone-200 text-stone-900 text-sm font-black
                           border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
                style={{ boxShadow: nesRaised }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSkill}
                className="px-4 py-2 bg-red-500 text-white text-sm font-black
                           border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
                style={{ boxShadow: nesDanger }}
              >
                Delete
              </button>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* ─── Delete Certificate Confirmation ─────────────────────── */}
        <AlertDialog open={!!deleteCertId} onOpenChange={open => !open && setDeleteCertId(null)}>
          <AlertDialogContent
            className="max-w-sm w-[92vw] bg-stone-100 border-2 border-stone-900 rounded p-0"
            style={{ boxShadow: nesRaised }}
          >
            <div className="bg-red-500 px-4 py-3 border-b-2 border-stone-900 rounded-t">
              <h2 className="text-base font-black text-white font-[family-name:var(--font-space-mono)]">
                ⚠️ Delete Certificate?
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm font-medium text-stone-700 font-[family-name:var(--font-space)]">
                This certificate will be permanently deleted. This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-4">
              <button
                onClick={() => setDeleteCertId(null)}
                className="px-4 py-2 bg-stone-200 text-stone-900 text-sm font-black
                           border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
                style={{ boxShadow: nesRaised }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCertificate}
                className="px-4 py-2 bg-red-500 text-white text-sm font-black
                           border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
                style={{ boxShadow: nesDanger }}
              >
                Delete
              </button>
            </div>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}