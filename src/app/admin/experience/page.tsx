"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Save, Loader2, Plus, Pencil, Trash2, GripVertical, Eye, Briefcase, Building, MapPin, ExternalLink, Terminal } from "lucide-react";
import { ensureUrlProtocol } from "@/lib/url";
import { toast } from "sonner";
import type { Experience } from "@/types/database.types";

// ─── Dynamic Imports ─────────────────────────────────────────────────────────
const ImageUploader = dynamic(
  () => import("@/components/admin/image-uploader").then((mod) => mod.ImageUploader),
  {
    ssr: false,
    loading: () => (
      <div className="text-sm font-black text-stone-500 font-[family-name:var(--font-space-mono)]">
        Loading uploader...
      </div>
    ),
  }
);

// ─── NES Shadow Tokens ────────────────────────────────────────────────────────
const nesRaised  = "inset -3px -3px 0px #6b6b6b, inset 3px 3px 0px #e0d8cc";
const nesPressed = "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc";
const nesDanger  = "inset -3px -3px 0px #7f0000, inset 3px 3px 0px #ff8080";

// ─── Reusable NES-style input wrapper ─────────────────────────────────────────
const nesInputCls =
  "w-full px-3 py-2.5 text-base font-medium text-stone-900 bg-stone-50 " +
  "border-2 border-stone-900 rounded focus:outline-none focus:border-amber-600 " +
  "placeholder:text-stone-400 font-[family-name:var(--font-space)] disabled:bg-stone-200 disabled:text-stone-500";

// ─── Field Label ──────────────────────────────────────────────────────────────
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

// ─── Timeline Color Array for Retro Vibe ──────────────────────────────────────
const TIMELINE_COLORS = [
  "bg-blue-400", "bg-emerald-400", "bg-violet-400", "bg-rose-400", "bg-amber-400"
];

// ─────────────────────────────────────────────────────────────────────────────
export default function ExperienceAdminPage() {
  const PAGE_SIZE = 20;
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<Experience> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // ─── Backend Logic (Unchanged) ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchExperiences() {
      const { data } = await supabase
        .from("experience")
        .select("*")
        .order("display_order", { ascending: true })
        .range(0, page * PAGE_SIZE - 1);

      if (data) {
        setExperiences(data);
        setHasMore(data.length >= page * PAGE_SIZE);
      }
      setIsLoading(false);
    }
    fetchExperiences();
  }, [supabase, page]);

  const handleSave = async () => {
    if (!editingItem) return;
    
    setIsSaving(true);
    try {
      const normalizeDate = (val: any) => {
        if (val === null || val === undefined || val === '') return null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(val))) return val;
        const parsed = new Date(String(val));
        if (!isNaN(parsed.getTime())) {
          const yyyy = parsed.getFullYear();
          const mm = String(parsed.getMonth() + 1).padStart(2, '0');
          const dd = String(parsed.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
        const m = String(val).match(/^(\w{3,})\s+(\d{2,4})$/);
        if (m) {
          const month = new Date(m[1] + ' 1, 2000').getMonth() + 1;
          let year = Number(m[2]);
          if (year < 100) year += year > 50 ? 1900 : 2000;
          const mm = String(month).padStart(2, '0');
          return `${year}-${mm}-01`;
        }
        return null;
      };
      const payload: any = { ...editingItem };
      
      payload.start_date = normalizeDate(payload.start_date ?? editingItem.start_date ?? null);
      payload.end_date = normalizeDate(payload.end_date ?? editingItem.end_date ?? null);

      if ((!payload.organization || payload.organization === '') && payload.company) {
        payload.organization = payload.company;
      }

      if (!payload.organization) {
        payload.organization = editingItem.company || editingItem.company || 'Unknown';
      }

      if (!payload.start_date) {
        payload.start_date = new Date().toISOString().slice(0, 10);
      }

      if (payload.is_current) payload.end_date = null;
      
      if (editingItem.id) {
        const { error } = await supabase
          .from("experience")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        
        setExperiences(prev => 
          prev.map(e => e.id === editingItem.id ? { ...e, ...payload } as Experience : e)
        );
      } else {
        const newOrder = experiences.length > 0 
          ? Math.max(...experiences.map(e => e.display_order)) + 1 
          : 0;
          
        const { data, error } = await supabase
          .from("experience")
          .insert([{ ...payload, display_order: newOrder }])
          .select()
          .single();

        if (error) throw error;
        if (data) setExperiences(prev => [...prev, data]);
      }

      toast.success(editingItem.id ? "Updated!" : "Added!");
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      console.error('Experience save error:', error);
      const message = (error && (error as any).message) ? (error as any).message : JSON.stringify(error) || 'Failed to save';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("experience").delete().eq("id", deleteId);
      if (error) throw error;
      setExperiences(prev => prev.filter(e => e.id !== deleteId));
      toast.success("Deleted!");
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete");
    }
  };

  // ─── Loading State ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div
          className="flex items-center justify-center h-14 w-14 bg-amber-100 border-2 border-stone-900 rounded"
          style={{ boxShadow: nesRaised }}
        >
          <Loader2 className="h-7 w-7 animate-spin text-stone-700" />
        </div>
        <p className="text-sm font-black text-stone-600 font-[family-name:var(--font-space-mono)]">Loading experience...</p>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-300 pb-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 pt-4 space-y-6">

        {/* ── Page Header ── */}
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
              <Briefcase className="h-6 w-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900 font-[family-name:var(--font-space-mono)] leading-tight">
                Experience
              </h1>
              <p className="text-sm font-medium text-stone-600 font-[family-name:var(--font-space)]">
                Manage your work experience
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-2 bg-stone-100 text-stone-900
                         text-sm font-black border-2 border-stone-900 rounded
                         font-[family-name:var(--font-space-mono)] transition-transform active:scale-95"
              style={{ boxShadow: nesRaised }}
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "List" : "Preview"}
            </button>

            <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setEditingItem({})}
                  className="flex items-center gap-2 px-3 py-2 bg-lime-400 text-stone-900
                             text-sm font-black border-2 border-stone-900 rounded
                             font-[family-name:var(--font-space-mono)] transition-transform active:scale-95"
                  style={{ boxShadow: nesRaised }}
                >
                  <Plus className="h-4 w-4" />
                  Add New
                </button>
              </DialogTrigger>

              {/* ── Edit / Add Dialog Content ── */}
              <DialogContent
                className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto
                           bg-stone-100 border-2 border-stone-900 rounded p-0"
                style={{ boxShadow: nesRaised }}
              >
                <DialogTitle className="sr-only">
                  {editingItem?.id ? "Edit Experience" : "Add Experience"}
                </DialogTitle>
                
                <div className="bg-lime-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
                  <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                    {editingItem?.id ? "✏️ Edit Experience" : "💼 Add New Experience"}
                  </h2>
                </div>
                
                <div className="space-y-4 px-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel htmlFor="title">Position *</FieldLabel>
                      <input
                        id="title"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.title || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g: Frontend Developer"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="employment_type">Employment Type</FieldLabel>
                      <input
                        id="employment_type"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.employment_type || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, employment_type: e.target.value }))}
                        placeholder="e.g: Full-time, Internship"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel htmlFor="company">Company *</FieldLabel>
                      <input
                        id="company"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.company || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="e.g: Tech Company"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="company_url">Company Website</FieldLabel>
                      <input
                        id="company_url"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.company_url || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, company_url: e.target.value }))}
                        placeholder="https://company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <input
                      id="location"
                      className={nesInputCls} style={{ boxShadow: nesPressed }}
                      value={editingItem?.location || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g: Dhaka, Bangladesh or Remote"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel htmlFor="start_date">Start Date</FieldLabel>
                      <input
                        id="start_date"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.start_date || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, start_date: e.target.value }))}
                        placeholder="e.g: Jan 2024"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="end_date">End Date</FieldLabel>
                      <input
                        id="end_date"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.end_date || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, end_date: e.target.value }))}
                        placeholder="e.g: Dec 2024 or leave empty"
                        disabled={editingItem?.is_current}
                      />
                    </div>
                  </div>

                  {/* Retro Switch Wrapper */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-stone-200 border-2 border-stone-900 rounded w-fit" style={{ boxShadow: nesRaised }}>
                    <Switch
                      id="is_current"
                      checked={editingItem?.is_current || false}
                      onCheckedChange={(checked) => setEditingItem(prev => ({ 
                        ...prev, 
                        is_current: checked,
                        end_date: checked ? null : prev?.end_date 
                      }))}
                    />
                    <label htmlFor="is_current" className="text-sm font-black text-stone-800 font-[family-name:var(--font-space-mono)] cursor-pointer mt-0.5">
                      Currently Working
                    </label>
                  </div>

                  <div>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <textarea
                      id="description"
                      className={nesInputCls} style={{ boxShadow: nesPressed }}
                      value={editingItem?.description || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed information about this job..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="skills_used">Skills Used</FieldLabel>
                    <input
                      id="skills_used"
                      className={nesInputCls} style={{ boxShadow: nesPressed }}
                      value={editingItem?.skills_used?.join(", ") || ""}
                      onChange={(e) => setEditingItem(prev => ({ 
                        ...prev, 
                        skills_used: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                      }))}
                      placeholder="React, TypeScript, Node.js (separated by commas)"
                    />
                  </div>

                  <div>
                    <FieldLabel>Company Logo</FieldLabel>
                    <div className="p-3 bg-stone-200 border-2 border-stone-900 rounded" style={{ boxShadow: nesPressed }}>
                      <ImageUploader
                        value={editingItem?.logo_url || ""}
                        onChange={(url) => setEditingItem(prev => ({ ...prev, logo_url: url }))}
                        preset="logo"
                        folder="experience"
                        alt={editingItem?.logo_alt || ""}
                        onAltChange={(alt) => setEditingItem(prev => ({ ...prev, logo_alt: alt }))}
                      />
                    </div>
                  </div>
                </div>

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
                    onClick={handleSave}
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
          </div>
        </div>

        {/* ════════════════════ PREVIEW MODE (TIMELINE) ════════════════════ */}
        {showPreview ? (
          <div className="relative py-8 pl-4 sm:pl-8">
            {/* Dashed Timeline Line */}
            <div className="absolute left-8 sm:left-12 top-10 bottom-10 w-0 border-l-[4px] border-dotted border-stone-900 opacity-60" />

            <div className="space-y-12">
              {experiences.map((exp, index) => {
                const accentColor = TIMELINE_COLORS[index % TIMELINE_COLORS.length];
                
                return (
                  <div key={exp.id} className="relative pl-12 sm:pl-20">
                    {/* Timeline Node (Retro square dot) */}
                    <div
                      className={`absolute left-[0.35rem] sm:left-[1.35rem] top-4 h-10 w-10 ${accentColor} border-2 border-stone-900 rounded flex items-center justify-center z-10`}
                      style={{ boxShadow: nesRaised }}
                    >
                      <Briefcase className="h-5 w-5 text-stone-900" />
                    </div>

                    {/* Timeline Card */}
                    <div
                      className="border-2 border-stone-900 rounded bg-stone-50 overflow-hidden"
                      style={{ boxShadow: nesRaised }}
                    >
                      {/* Card Header Strip */}
                      <div className={`${accentColor} h-2 border-b-2 border-stone-900`} />
                      
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-black text-stone-900 font-[family-name:var(--font-space-mono)] leading-snug">
                                {exp.title}
                              </h3>
                              {exp.employment_type && (
                                <span className="px-2 py-0.5 bg-stone-900 text-amber-300 text-xs font-black rounded border-2 border-stone-700 font-[family-name:var(--font-space-mono)]">
                                  {exp.employment_type}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-base font-black text-stone-700 mt-2 font-[family-name:var(--font-space-mono)] flex items-center gap-1">
                              {exp.company_url && ensureUrlProtocol(exp.company_url) ? (
                                <a href={ensureUrlProtocol(exp.company_url) || undefined} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 underline decoration-2 decoration-stone-900 underline-offset-4 flex items-center gap-1">
                                  {exp.company}
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              ) : exp.company}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-bold text-stone-600 font-[family-name:var(--font-space-mono)]">
                              <span className="px-2 py-1 bg-stone-200 border-2 border-stone-900 rounded">
                                ⏳ {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                              </span>
                              {exp.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {exp.location}
                                </span>
                              )}
                            </div>
                          </div>

                          {exp.logo_url && (
                            <div className="shrink-0 p-1 bg-white border-2 border-stone-900 rounded" style={{ boxShadow: nesPressed }}>
                              <img
                                src={exp.logo_url}
                                alt={exp.logo_alt || exp.company}
                                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                              />
                            </div>
                          )}
                        </div>

                        {exp.description && (
                          <div className="mt-4 pt-4 border-t-2 border-stone-300">
                            <p className="text-sm font-medium text-stone-700 whitespace-pre-wrap font-[family-name:var(--font-space)] leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        )}

                        {exp.skills_used && exp.skills_used.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            <div className="flex items-center mr-1 text-stone-500">
                              <Terminal className="h-4 w-4" />
                            </div>
                            {exp.skills_used.map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-stone-900 text-cyan-300 text-xs font-bold border-2 border-stone-700 rounded font-[family-name:var(--font-space-mono)]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ════════════════════ LIST MODE ════════════════════ */
          <div className="space-y-4">
            {experiences.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-14 gap-3 bg-stone-100 border-2 border-stone-900 rounded"
                style={{ boxShadow: nesRaised }}
              >
                <div
                  className="flex items-center justify-center h-16 w-16 bg-stone-200 border-2 border-stone-900 rounded"
                  style={{ boxShadow: nesRaised }}
                >
                  <Briefcase className="h-8 w-8 text-stone-500" />
                </div>
                <p className="text-base font-black text-stone-600 font-[family-name:var(--font-space-mono)]">
                  No experience entries yet
                </p>
                <button
                  onClick={() => setEditingItem({})}
                  className="flex items-center gap-2 px-4 py-2 mt-2 bg-lime-400 text-stone-900
                             text-sm font-black border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
                  style={{ boxShadow: nesRaised }}
                >
                  <Plus className="h-4 w-4" />
                  Add First Entry
                </button>
              </div>
            ) : (
              experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center gap-3 p-3 bg-stone-50 border-2 border-stone-900 rounded transition-transform"
                  style={{ boxShadow: nesRaised }}
                >
                  <div className="cursor-move text-stone-400 hover:text-stone-900 shrink-0">
                    <GripVertical className="h-6 w-6" />
                  </div>
                  
                  {exp.logo_url ? (
                    <div className="bg-white border-2 border-stone-900 rounded p-1 shrink-0">
                      <img
                        src={exp.logo_url}
                        alt={exp.logo_alt || exp.company}
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 border-2 border-stone-900 bg-stone-200 rounded flex items-center justify-center shrink-0">
                      <Building className="h-6 w-6 text-stone-500" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-stone-900 text-sm truncate font-[family-name:var(--font-space-mono)]">
                        {exp.title}
                      </h3>
                      {exp.is_current && (
                        <span className="px-1.5 py-0.5 bg-lime-300 text-stone-900 text-[10px] font-black border border-stone-900 rounded uppercase tracking-wider shrink-0">
                          Ongoing
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-stone-600 truncate font-[family-name:var(--font-space)] mt-0.5">
                      {exp.company}
                    </p>
                    <p className="text-[10px] font-black text-stone-400 font-[family-name:var(--font-space-mono)] mt-0.5 uppercase">
                      {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                    </p>
                  </div>
                  
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditingItem(exp)}
                      className="flex items-center justify-center h-9 w-9 bg-cyan-300 border-2 border-stone-900 rounded"
                      style={{ boxShadow: nesRaised }}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4 text-stone-900" />
                    </button>
                    <button
                      onClick={() => setDeleteId(exp.id)}
                      className="flex items-center justify-center h-9 w-9 bg-red-500 border-2 border-stone-900 rounded"
                      style={{ boxShadow: nesDanger }}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              ))
            )}
            
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-6 py-2 bg-stone-200 text-stone-900 text-sm font-black border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
                  style={{ boxShadow: nesRaised }}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Delete Confirmation (Retro Alert) ─── */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent
            className="max-w-sm w-[92vw] bg-stone-100 border-2 border-stone-900 rounded p-0"
            style={{ boxShadow: nesRaised }}
          >
            <div className="bg-red-500 px-4 py-3 border-b-2 border-stone-900 rounded-t">
              <h2 className="text-base font-black text-white font-[family-name:var(--font-space-mono)]">
                ⚠️ Delete Experience?
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm font-medium text-stone-700 font-[family-name:var(--font-space)]">
                This experience record will be permanently deleted. This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-stone-200 text-stone-900 text-sm font-black border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
                style={{ boxShadow: nesRaised }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white text-sm font-black border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)]"
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