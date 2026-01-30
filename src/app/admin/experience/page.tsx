"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader, ImageUploader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Save, Loader2, Plus, Pencil, Trash2, GripVertical, Eye, Briefcase, Building } from "lucide-react";
import { toast } from "sonner";
import type { Experience } from "@/types/database.types";

export default function ExperienceAdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Experience> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch all experiences
  useEffect(() => {
    async function fetchExperiences() {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (data) {
        setExperiences(data);
      }
      setIsLoading(false);
    }
    fetchExperiences();
  }, [supabase]);

  const handleSave = async () => {
    if (!editingItem) return;
    
    setIsSaving(true);
    try {
      console.log('Experience: saving item payload:', editingItem);
      // Normalize date inputs to ISO (YYYY-MM-DD) where possible
      const normalizeDate = (val: any) => {
        if (val === null || val === undefined || val === '') return null;
        // If already ISO-like, return as-is
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(val))) return val;
        // Try Date parse
        const parsed = new Date(String(val));
        if (!isNaN(parsed.getTime())) {
          // Use first day of month if only month-year provided
          const yyyy = parsed.getFullYear();
          const mm = String(parsed.getMonth() + 1).padStart(2, '0');
          const dd = String(parsed.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
        // Try matching patterns like "Jan 2024" or "Jan 24"
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
      // Normalize dates (accept freeform like 'Jan 2024')
      payload.start_date = normalizeDate(payload.start_date ?? editingItem.start_date ?? null);
      payload.end_date = normalizeDate(payload.end_date ?? editingItem.end_date ?? null);

      // Map legacy/UI field `company` to DB schema `organization` if needed
      if ((!payload.organization || payload.organization === '') && payload.company) {
        payload.organization = payload.company;
      }

      // Ensure required fields for DB constraints are present
      if (!payload.organization) {
        payload.organization = editingItem.company || editingItem.company || 'Unknown';
      }

      // If start_date is still null/empty (DB expects NOT NULL), default to today
      if (!payload.start_date) {
        payload.start_date = new Date().toISOString().slice(0, 10);
      }

      // If marked current, ensure end_date is null
      if (payload.is_current) payload.end_date = null;
      if (editingItem.id) {
        // Update
        const { error } = await supabase
          .from("experience")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        
        setExperiences(prev => 
          prev.map(e => e.id === editingItem.id ? { ...e, ...editingItem } as Experience : e)
        );
      } else {
        // Insert
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
      console.error('Experience save error (raw):', error);
      try { console.error('Experience save error (json):', JSON.stringify(error)); } catch {}
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
        .from("experience")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      
      setExperiences(prev => prev.filter(e => e.id !== deleteId));
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
          <h1 className="text-4xl font-black mb-2 tracking-tight border-b-4 border-black inline-block pb-1">Experience</h1>
          <p className="text-muted-foreground mt-2">Manage your work experience</p>
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem?.id ? "Edit Experience" : "Add New Experience"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Position *</Label>
                    <Input
                      id="title"
                      value={editingItem?.title || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g: Frontend Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Input
                      id="employment_type"
                      value={editingItem?.employment_type || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, employment_type: e.target.value }))}
                      placeholder="e.g: Full-time, Part-time, Internship"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={editingItem?.company || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g: Tech Company"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_url">Company Website</Label>
                    <Input
                      id="company_url"
                      value={editingItem?.company_url || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, company_url: e.target.value }))}
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingItem?.location || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g: Dhaka, Bangladesh or Remote"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      value={editingItem?.start_date || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, start_date: e.target.value }))}
                      placeholder="e.g: Jan 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      value={editingItem?.end_date || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, end_date: e.target.value }))}
                      placeholder="e.g: Dec 2024 or leave empty"
                      disabled={editingItem?.is_current}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_current"
                    checked={editingItem?.is_current || false}
                    onCheckedChange={(checked) => setEditingItem(prev => ({ 
                      ...prev, 
                      is_current: checked,
                      end_date: checked ? null : prev?.end_date 
                    }))}
                  />
                  <Label htmlFor="is_current">Currently Working</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingItem?.description || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed information about this job..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills_used">Skills Used</Label>
                  <Input
                    id="skills_used"
                    value={editingItem?.skills_used?.join(", ") || ""}
                    onChange={(e) => setEditingItem(prev => ({ 
                      ...prev, 
                      skills_used: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    }))}
                    placeholder="React, TypeScript, Node.js (separated by commas)"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Logo</Label>
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
        // Preview Mode - Timeline
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />
              
              <div className="space-y-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{exp.title}</h3>
                          {exp.employment_type && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded ml-2">
                              {exp.employment_type}
                            </span>
                          )}
                          <p className="text-sm font-medium mt-1">
                            {exp.company_url ? (
                              <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                {exp.company}
                              </a>
                            ) : exp.company}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                            {exp.location && ` • ${exp.location}`}
                          </p>
                        </div>
                        {exp.logo_url && (
                          <img
                            src={exp.logo_url}
                            alt={exp.logo_alt || exp.company}
                            className="h-12 w-12 rounded object-contain"
                          />
                        )}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">{exp.description}</p>
                      )}
                      {exp.skills_used && exp.skills_used.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {exp.skills_used.map((skill, i) => (
                            <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // List Mode
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No experience entries</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setEditingItem({})}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            experiences.map((exp) => (
              <Card key={exp.id} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  {exp.logo_url ? (
                    <img
                      src={exp.logo_url}
                      alt={exp.logo_alt || exp.company}
                      className="h-12 w-12 rounded object-contain bg-muted"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                      <Building className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {exp.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                    </p>
                  </div>
                  
                  {exp.is_current && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Ongoing
                    </span>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingItem(exp)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(exp.id)}
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
              This entry will be permanently deleted. This action cannot be undone.
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
