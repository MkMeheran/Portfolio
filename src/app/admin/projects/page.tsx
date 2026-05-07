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
  Save, Loader2, Plus, Pencil, Trash2, Eye,
  FolderKanban, ExternalLink, Github, Star,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { Project } from "@/types/database.types";

// ─── dynamic import (unchanged) ──────────────────────────────────────────────
const ImageUploader = dynamic(
  () => import("@/components/admin/image-uploader").then((mod) => mod.ImageUploader),
  {
    ssr: false,
    loading: () => <div className="text-sm text-stone-500">Loading uploader…</div>,
  }
);

// ─── NES shadow tokens ────────────────────────────────────────────────────────
const nesRaised  = "inset -3px -3px 0px #6b6b6b, inset 3px 3px 0px #e0d8cc";
const nesPressed = "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc";
const nesDanger  = "inset -3px -3px 0px #7f0000, inset 3px 3px 0px #ff8080";

// ─── Card accent colors (cycle per project) ───────────────────────────────────
const ACCENT_COLORS = [
  "#fbbf24", // amber
  "#fb923c", // orange
  "#a3e635", // lime
  "#e879f9", // fuchsia
  "#22d3ee", // cyan
  "#fb7185", // rose
  "#a78bfa", // violet
  "#2dd4bf", // teal
];

// ─── Shared input className ───────────────────────────────────────────────────
const nesInputCls =
  "w-full px-3 py-2.5 text-base font-medium text-stone-900 bg-stone-50 " +
  "border-2 border-stone-900 rounded focus:outline-none focus:border-amber-600 " +
  "placeholder:text-stone-400 font-[family-name:var(--font-space)]";

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

// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectsAdminPage() {
  // ── ALL LOGIC UNCHANGED ───────────────────────────────────────────────────
  const PAGE_SIZE = 20;
  const router = useRouter();
  const supabase = createClient();

  const [isLoading,   setIsLoading]   = useState(true);
  const [isSaving,    setIsSaving]    = useState(false);
  const [projects,    setProjects]    = useState<Project[]>([]);
  const [page,        setPage]        = useState(1);
  const [hasMore,     setHasMore]     = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<Project> | null>(null);
  const [deleteId,    setDeleteId]    = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true })
        .range(0, page * PAGE_SIZE - 1);
      if (data) { setProjects(data); setHasMore(data.length >= page * PAGE_SIZE); }
      setIsLoading(false);
    }
    fetchProjects();
  }, [supabase, page]);

  const handleSave = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    try {
      console.log("Projects: saving item payload:", editingItem);
      const slugify = (s?: string) =>
        s ? s.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") : "";
      if (!editingItem.slug || editingItem.slug === "") {
        (editingItem as any).slug = slugify(editingItem.title || String(Date.now()));
      }
      if (editingItem.id) {
        const { error } = await supabase
          .from("projects")
          .update({ ...editingItem, updated_at: new Date().toISOString() })
          .eq("id", editingItem.id);
        if (error) throw error;
        setProjects(prev => prev.map(p => p.id === editingItem.id ? { ...p, ...editingItem } as Project : p));
      } else {
        const newOrder = projects.length > 0 ? Math.max(...projects.map(p => p.display_order)) + 1 : 0;
        const toInsert = { ...editingItem, display_order: newOrder } as any;
        if (!toInsert.slug) toInsert.slug = slugify(toInsert.title || String(Date.now()));
        const { data, error } = await supabase.from("projects").insert([toInsert]).select().single();
        if (error) throw error;
        if (data) setProjects(prev => [...prev, data]);
      }
      toast.success(editingItem.id ? "Updated!" : "Added!");
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      console.error("Projects save error (raw):", error);
      try { console.error("Projects save error (json):", JSON.stringify(error)); } catch {}
      const message = (error && (error as any).message) ? (error as any).message : JSON.stringify(error) || "Failed to save";
      toast.error(message);
    } finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", deleteId);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== deleteId));
      toast.success("Deleted!");
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete");
    }
  };
  // ── END UNCHANGED LOGIC ───────────────────────────────────────────────────

  // ── Project form content ──────────────────────────────────────────────────
  const projectForm = (
    <div className="space-y-4 py-2">
      {/* Name + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="title">Project Name *</FieldLabel>
          <input id="title" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingItem?.title || ""}
            onChange={e => setEditingItem(p => ({ ...p, title: e.target.value }))}
            placeholder="e.g: Portfolio Website" />
        </div>
        <div>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <input id="category" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingItem?.category || ""}
            onChange={e => setEditingItem(p => ({ ...p, category: e.target.value }))}
            placeholder="e.g: Web Development" />
        </div>
      </div>

      {/* Short description */}
      <div>
        <FieldLabel htmlFor="short_description">Short Description</FieldLabel>
        <input id="short_description" className={nesInputCls} style={{ boxShadow: nesPressed }}
          value={editingItem?.short_description || ""}
          onChange={e => setEditingItem(p => ({ ...p, short_description: e.target.value }))}
          placeholder="One line description of the project" />
      </div>

      {/* Full description */}
      <div>
        <FieldLabel htmlFor="description">Full Description</FieldLabel>
        <textarea id="description" rows={4} className={nesInputCls} style={{ boxShadow: nesPressed }}
          value={editingItem?.description || ""}
          onChange={e => setEditingItem(p => ({ ...p, description: e.target.value }))}
          placeholder="Detailed information about the project…" />
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="live_url">Live URL</FieldLabel>
          <input id="live_url" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingItem?.live_url || ""}
            onChange={e => setEditingItem(p => ({ ...p, live_url: e.target.value }))}
            placeholder="https://project.com" />
        </div>
        <div>
          <FieldLabel htmlFor="github_url">GitHub URL</FieldLabel>
          <input id="github_url" className={nesInputCls} style={{ boxShadow: nesPressed }}
            value={editingItem?.github_url || ""}
            onChange={e => setEditingItem(p => ({ ...p, github_url: e.target.value }))}
            placeholder="https://github.com/user/repo" />
        </div>
      </div>

      {/* Technologies */}
      <div>
        <FieldLabel htmlFor="technologies">Technologies / Skills</FieldLabel>
        <input id="technologies" className={nesInputCls} style={{ boxShadow: nesPressed }}
          value={editingItem?.technologies?.join(", ") || ""}
          onChange={e => setEditingItem(p => ({
            ...p,
            technologies: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
          }))}
          placeholder="React, Next.js, TypeScript (comma separated)" />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 bg-amber-50 border-2 border-stone-900 rounded"
          style={{ boxShadow: nesRaised }}
        >
          <Switch
            id="is_featured"
            checked={editingItem?.is_featured || false}
            onCheckedChange={c => setEditingItem(p => ({ ...p, is_featured: c }))}
          />
          <label htmlFor="is_featured"
            className="text-sm font-black text-stone-800 font-[family-name:var(--font-space-mono)] cursor-pointer">
            Featured
          </label>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 bg-lime-50 border-2 border-stone-900 rounded"
          style={{ boxShadow: nesRaised }}
        >
          <Switch
            id="is_active"
            checked={editingItem?.is_active !== false}
            onCheckedChange={c => setEditingItem(p => ({ ...p, is_active: c }))}
          />
          <label htmlFor="is_active"
            className="text-sm font-black text-stone-800 font-[family-name:var(--font-space-mono)] cursor-pointer">
            Active
          </label>
        </div>
      </div>

      {/* Thumbnail */}
      <div>
        <FieldLabel>Thumbnail Image</FieldLabel>
        <ImageUploader
          value={editingItem?.thumbnail_url || ""}
          onChange={url => setEditingItem(p => ({ ...p, thumbnail_url: url }))}
          preset="project"
          folder="projects"
          alt={editingItem?.thumbnail_alt || ""}
          onAltChange={alt => setEditingItem(p => ({ ...p, thumbnail_alt: alt }))}
        />
      </div>

      {/* Gallery */}
      <div>
        <FieldLabel>Gallery Images</FieldLabel>
        <p className="text-xs font-medium text-stone-500 mb-1 font-[family-name:var(--font-space)]">
          Separate multiple URLs with commas
        </p>
        <textarea rows={3} className={nesInputCls} style={{ boxShadow: nesPressed }}
          value={editingItem?.gallery_images?.join(",\n") || ""}
          onChange={e => setEditingItem(p => ({
            ...p,
            gallery_images: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
          }))}
          placeholder={"https://image1.jpg,\nhttps://image2.jpg"} />
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div
          className="flex items-center justify-center h-14 w-14 bg-amber-100 border-2 border-stone-900 rounded"
          style={{ boxShadow: nesRaised }}
        >
          <Loader2 className="h-7 w-7 animate-spin text-stone-700" />
        </div>
        <p className="text-sm font-black text-stone-600 font-[family-name:var(--font-space-mono)]">
          Loading projects…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-300 pb-8">
      <div className="max-w-2xl mx-auto px-2 sm:px-4 pt-4 space-y-4">

        {/* ── Page header ───────────────────────────────────────────────── */}
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
              <FolderKanban className="h-6 w-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900 font-[family-name:var(--font-space-mono)] leading-tight">
                Projects
              </h1>
              <p className="text-sm font-medium text-stone-600 font-[family-name:var(--font-space)]">
                Manage your project portfolio
              </p>
            </div>
          </div>

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

            {/* Add Project dialog */}
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
                  Add Project
                </button>
              </DialogTrigger>

              <DialogContent
                className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto
                           bg-stone-100 border-2 border-stone-900 rounded p-0"
                style={{ boxShadow: nesRaised }}
              >
                <DialogTitle className="sr-only">
                  {editingItem?.id ? "Edit Project" : "Add New Project"}
                </DialogTitle>
                <div className="bg-amber-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
                  <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                    {editingItem?.id ? "✏️ Edit Project" : "➕ Add New Project"}
                  </h2>
                </div>
                <div className="px-4 pb-2">{projectForm}</div>
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

        {/* ════════════════════ PREVIEW MODE ════════════════════ */}
        {showPreview ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="border-2 border-stone-900 rounded bg-stone-50 overflow-hidden"
                style={{ boxShadow: nesRaised }}
              >
                {/* Thumbnail */}
                <div
                  className="relative w-full bg-stone-200 border-b-2 border-stone-900"
                  style={{ aspectRatio: "16/9" }}
                >
                  {project.thumbnail_url ? (
                    <Image
                      src={project.thumbnail_url}
                      alt={project.thumbnail_alt || project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FolderKanban className="h-10 w-10 text-stone-400" />
                    </div>
                  )}
                  {project.is_featured && (
                    <div className="absolute top-2 right-2">
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-stone-900
                                   text-xs font-black border border-stone-900 rounded
                                   font-[family-name:var(--font-space-mono)]"
                      >
                        <Star className="h-3 w-3" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-3 space-y-2">
                  {/* Header strip */}
                  <div
                    className="h-1 w-full rounded"
                    style={{ background: ACCENT_COLORS[idx % ACCENT_COLORS.length] }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-black text-base text-stone-900 truncate font-[family-name:var(--font-space-mono)]">
                        {project.title}
                      </p>
                      {project.category && (
                        <p className="text-xs font-medium text-stone-500">{project.category}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center h-8 w-8 bg-lime-300 border-2 border-stone-900 rounded"
                          style={{ boxShadow: nesRaised }}>
                          <ExternalLink className="h-3.5 w-3.5 text-stone-900" />
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center h-8 w-8 bg-stone-800 border-2 border-stone-900 rounded"
                          style={{ boxShadow: nesRaised }}>
                          <Github className="h-3.5 w-3.5 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.short_description && (
                    <p className="text-sm text-stone-600 line-clamp-2 font-[family-name:var(--font-space)]">
                      {project.short_description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-stone-800 text-amber-200 text-xs font-bold
                                     border border-stone-600 rounded font-[family-name:var(--font-space-mono)]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-xs font-bold text-stone-500">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        ) : (
          /* ════════════════════ LIST MODE ════════════════════ */
          <div className="space-y-2">
            {projects.length === 0 ? (
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
                  <FolderKanban className="h-9 w-9 text-stone-600" />
                </div>
                <p className="text-base font-black text-stone-600 font-[family-name:var(--font-space-mono)]">
                  No projects yet
                </p>
                <button
                  onClick={() => setEditingItem({})}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-stone-900
                             text-sm font-black border-2 border-stone-900 rounded
                             font-[family-name:var(--font-space-mono)]"
                  style={{ boxShadow: nesRaised }}
                >
                  <Plus className="h-4 w-4" />
                  Add First Project
                </button>
              </div>
            ) : (
              projects.map((project, idx) => (
                <div
                  key={project.id}
                  className="flex items-center gap-2 px-2 py-2.5 bg-stone-50
                             border-2 border-stone-900 rounded overflow-hidden"
                  style={{
                    boxShadow: nesRaised,
                    borderLeft: `5px solid ${ACCENT_COLORS[idx % ACCENT_COLORS.length]}`,
                  }}
                >
                  {/* Thumbnail (small) */}
                  <div
                    className="relative h-10 w-14 border-2 border-stone-900 rounded shrink-0 bg-stone-200 overflow-hidden"
                    style={{ boxShadow: nesPressed }}
                  >
                    {project.thumbnail_url ? (
                      <Image
                        src={project.thumbnail_url}
                        alt={project.thumbnail_alt || project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FolderKanban className="h-4 w-4 text-stone-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-stone-900 truncate font-[family-name:var(--font-space-mono)]">
                        {project.title}
                      </span>
                      {project.is_featured && (
                        <Star className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      )}
                      {!project.is_active && (
                        <span
                          className="px-1.5 py-0.5 bg-stone-400 text-white text-xs font-black
                                     border border-stone-600 rounded font-[family-name:var(--font-space-mono)] shrink-0"
                        >
                          Off
                        </span>
                      )}
                    </div>
                    {(project.short_description || project.category) && (
                      <p className="text-xs text-stone-500 truncate font-[family-name:var(--font-space)]">
                        {project.short_description || project.category}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-8 w-8 bg-lime-300
                                   border-2 border-stone-900 rounded"
                        style={{ boxShadow: nesRaised }}
                        title="Live site"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-stone-900" />
                      </a>
                    )}
                    <button
                      onClick={() => setEditingItem(project)}
                      className="flex items-center justify-center h-8 w-8 bg-cyan-300
                                 border-2 border-stone-900 rounded"
                      style={{ boxShadow: nesRaised }}
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5 text-stone-900" />
                    </button>
                    <button
                      onClick={() => setDeleteId(project.id)}
                      className="flex items-center justify-center h-8 w-8 bg-red-500
                                 border-2 border-stone-900 rounded"
                      style={{ boxShadow: nesDanger }}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                </div>
              ))
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

        {/* ─── Delete Confirmation ──────────────────────────────────────── */}
        <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent
            className="max-w-sm w-[92vw] bg-stone-100 border-2 border-stone-900 rounded p-0"
            style={{ boxShadow: nesRaised }}
          >
            <AlertDialogTitle className="sr-only">Delete Project</AlertDialogTitle>
            <div className="bg-red-500 px-4 py-3 border-b-2 border-stone-900 rounded-t">
              <h2 className="text-base font-black text-white font-[family-name:var(--font-space-mono)]">
                ⚠️ Delete Project?
              </h2>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm font-medium text-stone-700 font-[family-name:var(--font-space)]">
                This project will be permanently deleted. This action cannot be undone.
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
                onClick={handleDelete}
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