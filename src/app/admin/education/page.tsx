"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
import { Save, Loader2, Plus, Pencil, Trash2, GripVertical, Eye, GraduationCap, MapPin, Award } from "lucide-react";
import { toast } from "sonner";
import type { Education } from "@/types/database.types";

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
  "placeholder:text-stone-400 font-[family-name:var(--font-space)]";

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
  "bg-amber-400", "bg-cyan-400", "bg-lime-400", "bg-fuchsia-400", "bg-orange-400"
];

// ─────────────────────────────────────────────────────────────────────────────
export default function EducationAdminPage() {
  const PAGE_SIZE = 20;
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [educations, setEducations] = useState<Education[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<Education> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // ─── Backend Logic (Unchanged) ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchEducations() {
      const { data } = await supabase
        .from("education")
        .select("*")
        .order("display_order", { ascending: true })
        .range(0, page * PAGE_SIZE - 1);

      if (data) {
        setEducations(data);
        setHasMore(data.length >= page * PAGE_SIZE);
      }
      setIsLoading(false);
    }
    fetchEducations();
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
      if (payload.is_current) payload.end_date = null;

      if (!payload.field && payload.field_of_study) payload.field = payload.field_of_study;
      if (!payload.gpa && payload.grade) payload.gpa = payload.grade;

      if (!('order_index' in payload) && ('display_order' in payload)) payload.order_index = payload.display_order;

      if (!payload.degree || !payload.institution) {
        toast.error('Degree and Institution are required');
        setIsSaving(false);
        return;
      }
      if (!payload.start_date) {
        payload.start_date = new Date().toISOString().slice(0,10);
      }

      if (editingItem.id) {
        const { error } = await supabase
          .from("education")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        
        setEducations(prev => 
          prev.map(e => e.id === editingItem.id ? { ...e, ...payload } as Education : e)
        );
      } else {
        const newOrder = educations.length > 0 
          ? Math.max(...educations.map(e => e.display_order ?? 0)) + 1 
          : 0;
          
        const { data, error } = await supabase
          .from("education")
          .insert([{ ...payload, display_order: newOrder }])
          .select()
          .single();

        if (error) throw error;
        if (data) setEducations(prev => [...prev, data]);
      }

      toast.success(editingItem.id ? "Updated!" : "Added!");
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      console.error('Education save error:', error);
      const message = (error && (error as any).message) ? (error as any).message : JSON.stringify(error) || 'Failed to save';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("education").delete().eq("id", deleteId);
      if (error) throw error;
      setEducations(prev => prev.filter(e => e.id !== deleteId));
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
        <p className="text-sm font-black text-stone-600 font-[family-name:var(--font-space-mono)]">Loading education...</p>
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
              <GraduationCap className="h-6 w-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900 font-[family-name:var(--font-space-mono)] leading-tight">
                Education
              </h1>
              <p className="text-sm font-medium text-stone-600 font-[family-name:var(--font-space)]">
                Manage your academic background
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
                  {editingItem?.id ? "Edit Education" : "Add Education"}
                </DialogTitle>
                
                <div className="bg-lime-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
                  <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                    {editingItem?.id ? "✏️ Edit Education" : "🎓 Add New Education"}
                  </h2>
                </div>
                
                <div className="space-y-4 px-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel htmlFor="degree">Degree/Certificate *</FieldLabel>
                      <input
                        id="degree"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.degree || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, degree: e.target.value }))}
                        placeholder="e.g: Bachelor of Science"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="field_of_study">Field of Study *</FieldLabel>
                      <input
                        id="field_of_study"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.field_of_study || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, field_of_study: e.target.value }))}
                        placeholder="e.g: Urban & Regional Planning"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="institution">Institution *</FieldLabel>
                    <input
                      id="institution"
                      className={nesInputCls} style={{ boxShadow: nesPressed }}
                      value={editingItem?.institution || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, institution: e.target.value }))}
                      placeholder="e.g: Khulna University of Engineering & Technology"
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="institution_short">Institution (Short)</FieldLabel>
                    <input
                      id="institution_short"
                      className={nesInputCls} style={{ boxShadow: nesPressed }}
                      value={editingItem?.institution_short || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, institution_short: e.target.value }))}
                      placeholder="e.g: KUET"
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
                        placeholder="e.g: 2024 or Jan 2024"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="end_date">End Date</FieldLabel>
                      <input
                        id="end_date"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.end_date || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, end_date: e.target.value }))}
                        placeholder="e.g: 2028 or Ongoing"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel htmlFor="grade">Grade/Result</FieldLabel>
                      <input
                        id="grade"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.grade || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, grade: e.target.value }))}
                        placeholder="e.g: CGPA 3.85"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="location">Location</FieldLabel>
                      <input
                        id="location"
                        className={nesInputCls} style={{ boxShadow: nesPressed }}
                        value={editingItem?.location || ""}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g: Khulna, Bangladesh"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <textarea
                      id="description"
                      className={nesInputCls} style={{ boxShadow: nesPressed }}
                      value={editingItem?.description || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed information about this education..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <FieldLabel>Institution Logo</FieldLabel>
                    <div className="p-3 bg-stone-200 border-2 border-stone-900 rounded" style={{ boxShadow: nesPressed }}>
                      <ImageUploader
                        value={editingItem?.logo_url || ""}
                        onChange={(url) => setEditingItem(prev => ({ ...prev, logo_url: url }))}
                        preset="logo"
                        folder="education"
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
              {educations.map((edu, index) => {
                const accentColor = TIMELINE_COLORS[index % TIMELINE_COLORS.length];
                
                return (
                  <div key={edu.id} className="relative pl-12 sm:pl-20">
                    {/* Timeline Node (Retro square dot) */}
                    <div
                      className={`absolute left-[0.35rem] sm:left-[1.35rem] top-4 h-10 w-10 ${accentColor} border-2 border-stone-900 rounded flex items-center justify-center z-10`}
                      style={{ boxShadow: nesRaised }}
                    >
                      <GraduationCap className="h-5 w-5 text-stone-900" />
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
                            <h3 className="text-lg font-black text-stone-900 font-[family-name:var(--font-space-mono)] leading-snug">
                              {edu.degree}
                            </h3>
                            <p className="text-sm font-bold text-stone-600 font-[family-name:var(--font-space-mono)] mt-1">
                              {edu.field_of_study}
                            </p>
                            
                            <p className="text-base font-black text-stone-800 mt-3 font-[family-name:var(--font-space)]">
                              {edu.institution}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-bold text-stone-500 font-[family-name:var(--font-space-mono)]">
                              <span className="px-2 py-1 bg-stone-200 border-2 border-stone-900 rounded">
                                ⏳ {edu.start_date} - {edu.end_date || "Ongoing"}
                              </span>
                              {edu.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {edu.location}
                                </span>
                              )}
                            </div>

                            {edu.grade && (
                              <div className="inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 bg-stone-900 text-amber-300 text-sm font-black rounded border-2 border-stone-700 font-[family-name:var(--font-space-mono)]">
                                <Award className="h-4 w-4" />
                                {edu.grade}
                              </div>
                            )}
                          </div>

                          {edu.logo_url && (
                            <div className="shrink-0 p-1 bg-white border-2 border-stone-900 rounded" style={{ boxShadow: nesPressed }}>
                              <img
                                src={edu.logo_url}
                                alt={edu.logo_alt || edu.institution}
                                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                              />
                            </div>
                          )}
                        </div>

                        {edu.description && (
                          <div className="mt-4 pt-4 border-t-2 border-stone-300">
                            <p className="text-sm font-medium text-stone-700 whitespace-pre-wrap font-[family-name:var(--font-space)] leading-relaxed">
                              {edu.description}
                            </p>
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
            {educations.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-14 gap-3 bg-stone-100 border-2 border-stone-900 rounded"
                style={{ boxShadow: nesRaised }}
              >
                <div
                  className="flex items-center justify-center h-16 w-16 bg-stone-200 border-2 border-stone-900 rounded"
                  style={{ boxShadow: nesRaised }}
                >
                  <GraduationCap className="h-8 w-8 text-stone-500" />
                </div>
                <p className="text-base font-black text-stone-600 font-[family-name:var(--font-space-mono)]">
                  No education entries yet
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
              educations.map((edu, idx) => (
                <div
                  key={edu.id}
                  className="flex items-center gap-3 p-3 bg-stone-50 border-2 border-stone-900 rounded transition-transform"
                  style={{ boxShadow: nesRaised }}
                >
                  <div className="cursor-move text-stone-400 hover:text-stone-900 shrink-0">
                    <GripVertical className="h-6 w-6" />
                  </div>
                  
                  {edu.logo_url ? (
                    <div className="bg-white border-2 border-stone-900 rounded p-1 shrink-0">
                      <img
                        src={edu.logo_url}
                        alt={edu.logo_alt || edu.institution}
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 border-2 border-stone-900 bg-stone-200 rounded flex items-center justify-center shrink-0">
                      <GraduationCap className="h-6 w-6 text-stone-500" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-stone-900 text-sm truncate font-[family-name:var(--font-space-mono)]">
                      {edu.degree}
                    </h3>
                    <p className="text-xs font-bold text-stone-600 truncate font-[family-name:var(--font-space)]">
                      {edu.institution_short || edu.institution}
                    </p>
                    <p className="text-[10px] font-black text-stone-400 font-[family-name:var(--font-space-mono)] mt-0.5 uppercase">
                      {edu.start_date} - {edu.end_date || "Ongoing"}
                    </p>
                  </div>
                  
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditingItem(edu)}
                      className="flex items-center justify-center h-9 w-9 bg-cyan-300 border-2 border-stone-900 rounded"
                      style={{ boxShadow: nesRaised }}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4 text-stone-900" />
                    </button>
                    <button
                      onClick={() => setDeleteId(edu.id)}
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
                ⚠️ Delete Education?
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm font-medium text-stone-700 font-[family-name:var(--font-space)]">
                This academic record will be permanently deleted. This cannot be undone.
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