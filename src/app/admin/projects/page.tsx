"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader, ImageUploader } from "@/components/admin";
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
  FolderKanban, ExternalLink, Github, Star 
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { Project } from "@/types/database.types";

export default function ProjectsAdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Project> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch all projects
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (data) {
        setProjects(data);
      }
      setIsLoading(false);
    }
    fetchProjects();
  }, [supabase]);

  const handleSave = async () => {
    if (!editingItem) return;
    
    setIsSaving(true);
    try {
      console.log('Projects: saving item payload:', editingItem);
      // Ensure slug exists (DB requires non-null slug)
      const slugify = (s?: string) => s ? s.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') : '';
      if (!editingItem.slug || editingItem.slug === '') {
        (editingItem as any).slug = slugify(editingItem.title || String(Date.now()));
      }
      if (editingItem.id) {
        // Update
        const { error } = await supabase
          .from("projects")
          .update({
            ...editingItem,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        
        setProjects(prev => 
          prev.map(p => p.id === editingItem.id ? { ...p, ...editingItem } as Project : p)
        );
      } else {
        // Insert
        const newOrder = projects.length > 0 
          ? Math.max(...projects.map(p => p.display_order)) + 1 
          : 0;
          
        const toInsert = { ...editingItem, display_order: newOrder } as any;
        // enforce slug on insert
        if (!toInsert.slug) toInsert.slug = slugify(toInsert.title || String(Date.now()));
        const { data, error } = await supabase
          .from("projects")
          .insert([toInsert])
          .select()
          .single();

        if (error) throw error;
        if (data) setProjects(prev => [...prev, data]);
      }

      toast.success(editingItem.id ? "Updated!" : "Added!");
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      console.error('Projects save error (raw):', error);
      try { console.error('Projects save error (json):', JSON.stringify(error)); } catch {}
      const message = (error && (error as any).message) ? (error as any).message : JSON.stringify(error) || 'Failed to save';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== deleteId));
      toast.success("Deleted!");
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight border-b-4 border-black inline-block pb-1">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your project portfolio</p>
        </div> 
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "List" : "Preview"}
          </Button>
          <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem({})} className="bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem?.id ? "Edit Project" : "Add New Project"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Name *</Label>
                    <Input
                      id="title"
                      value={editingItem?.title || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g: Portfolio Website"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editingItem?.category || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g: Web Development"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={editingItem?.short_description || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="One line description of the project"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={editingItem?.description || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed information about the project..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="live_url">Live URL</Label>
                    <Input
                      id="live_url"
                      value={editingItem?.live_url || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, live_url: e.target.value }))}
                      placeholder="https://project.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      value={editingItem?.github_url || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, github_url: e.target.value }))}
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies/Skills</Label>
                  <Input
                    id="technologies"
                    value={editingItem?.technologies?.join(", ") || ""}
                    onChange={(e) => setEditingItem(prev => ({ 
                      ...prev, 
                      technologies: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    }))}
                    placeholder="React, Next.js, TypeScript (separated by commas)"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={editingItem?.is_featured || false}
                      onCheckedChange={(checked) => setEditingItem(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={editingItem?.is_active !== false}
                      onCheckedChange={(checked) => setEditingItem(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Thumbnail Image</Label>
                  <ImageUploader
                    value={editingItem?.thumbnail_url || ""}
                    onChange={(url) => setEditingItem(prev => ({ ...prev, thumbnail_url: url }))}
                    preset="project"
                    folder="projects"
                    alt={editingItem?.thumbnail_alt || ""}
                    onAltChange={(alt) => setEditingItem(prev => ({ ...prev, thumbnail_alt: alt }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gallery Images (Multiple)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Separate multiple image URLs with commas
                  </p>
                  <Textarea
                    value={editingItem?.gallery_images?.join(",\n") || ""}
                    onChange={(e) => setEditingItem(prev => ({ 
                      ...prev, 
                      gallery_images: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    }))}
                    placeholder="https://image1.jpg,&#10;https://image2.jpg"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showPreview ? (
        // Preview Mode - Grid
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden group border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="relative aspect-video bg-muted">
                {project.thumbnail_url ? (
                  <Image
                    src={project.thumbnail_url}
                    alt={project.thumbnail_alt || project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FolderKanban className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {project.is_featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      <Badge variant="outline" className="text-xs">Featured</Badge>
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.category && (
                      <p className="text-xs text-muted-foreground">{project.category}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {project.live_url && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                {project.short_description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {project.short_description}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.technologies.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List Mode
        <div className="space-y-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No projects</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setEditingItem({})}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="flex items-center gap-4 p-4">
                  {project.thumbnail_url ? (
                    <div className="relative h-16 w-24 rounded overflow-hidden bg-muted shrink-0">
                      <Image
                        src={project.thumbnail_url}
                        alt={project.thumbnail_alt || project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-24 rounded bg-muted flex items-center justify-center shrink-0">
                      <FolderKanban className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{project.title}</h3>
                      {project.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 shrink-0" />
                      )}
                      {!project.is_active && (
                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {project.short_description || project.category}
                    </p>
                    {project.technologies && (
                      <div className="flex gap-1 mt-1">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {project.live_url && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingItem(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This project will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
