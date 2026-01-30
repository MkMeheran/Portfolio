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
import { Save, Loader2, Plus, Pencil, Trash2, GripVertical, Eye, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import type { Education } from "@/types/database.types";

export default function EducationAdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [educations, setEducations] = useState<Education[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Education> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch all educations
  useEffect(() => {
    async function fetchEducations() {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (data) {
        setEducations(data);
      }
      setIsLoading(false);
    }
    fetchEducations();
  }, [supabase]);

  const handleSave = async () => {
    if (!editingItem) return;
    
    setIsSaving(true);
    try {
      // Normalize helper (accept freeform like '2024' or 'Jan 2024')
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

      // Build payload from editingItem and map UI keys to DB columns
      const payload: any = { ...editingItem };
      payload.start_date = normalizeDate(payload.start_date ?? editingItem.start_date ?? null);
      payload.end_date = normalizeDate(payload.end_date ?? editingItem.end_date ?? null);
      if (payload.is_current) payload.end_date = null;

      console.log('Education: saving payload:', payload);

      // Map field names: UI uses `field_of_study` and `grade`; DB schema expects `field` and `gpa`
      if (!payload.field && payload.field_of_study) payload.field = payload.field_of_study;
      if (!payload.gpa && payload.grade) payload.gpa = payload.grade;

      // Map display/order naming differences
      if (!('order_index' in payload) && ('display_order' in payload)) payload.order_index = payload.display_order;

      // Ensure required fields present for DB (degree, institution, start_date)
      if (!payload.degree || !payload.institution) {
        toast.error('Degree and Institution are required');
        setIsSaving(false);
        return;
      }
      if (!payload.start_date) {
        // default to today if user didn't provide
        payload.start_date = new Date().toISOString().slice(0,10);
      }

      if (editingItem.id) {
        // Update
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
        // Insert
        const newOrder = educations.length > 0 
          ? Math.max(...educations.map(e => e.display_order ?? e.order_index ?? 0)) + 1 
          : 0;
          
        const { data, error } = await supabase
          .from("education")
          .insert([{ ...payload, order_index: newOrder }])
          .select()
          .single();

        if (error) throw error;
        if (data) setEducations(prev => [...prev, data]);
      }

      toast.success(editingItem.id ? "Updated!" : "Added!");
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      console.error('Education save error (raw):', error);
      try { console.error('Education save error (json):', JSON.stringify(error)); } catch {}
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
        .from("education")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      
      setEducations(prev => prev.filter(e => e.id !== deleteId));
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
          <h1 className="text-4xl font-black mb-2 tracking-tight border-b-4 border-black inline-block pb-1">Education</h1>
          <p className="text-muted-foreground mt-2">Manage your education information</p>
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
                  {editingItem?.id ? "Edit Education" : "Add New Education"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree/Certificate *</Label>
                    <Input
                      id="degree"
                      value={editingItem?.degree || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, degree: e.target.value }))}
                      placeholder="e.g: Bachelor of Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field_of_study">Field of Study *</Label>
                    <Input
                      id="field_of_study"
                      value={editingItem?.field_of_study || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, field_of_study: e.target.value }))}
                      placeholder="e.g: Urban & Regional Planning"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    value={editingItem?.institution || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, institution: e.target.value }))}
                    placeholder="e.g: Khulna University of Engineering & Technology"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution_short">Institution (Short)</Label>
                  <Input
                    id="institution_short"
                    value={editingItem?.institution_short || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, institution_short: e.target.value }))}
                    placeholder="e.g: KUET"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      value={editingItem?.start_date || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, start_date: e.target.value }))}
                      placeholder="e.g: 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      value={editingItem?.end_date || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, end_date: e.target.value }))}
                      placeholder="e.g: 2028 or Ongoing"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Result</Label>
                    <Input
                      id="grade"
                      value={editingItem?.grade || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, grade: e.target.value }))}
                      placeholder="e.g: CGPA 3.85"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editingItem?.location || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g: Khulna, Bangladesh"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingItem?.description || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed information about this education..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Institution Logo</Label>
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
                {educations.map((edu, index) => (
                  <div key={edu.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                          <p className="text-sm font-medium mt-1">{edu.institution}</p>
                          <p className="text-xs text-muted-foreground">
                            {edu.start_date} - {edu.end_date || "Ongoing"}
                          </p>
                          {edu.grade && (
                            <p className="text-sm mt-2 text-primary font-medium">{edu.grade}</p>
                          )}
                        </div>
                        {edu.logo_url && (
                          <img
                            src={edu.logo_url}
                            alt={edu.logo_alt || edu.institution}
                            className="h-12 w-12 rounded object-contain"
                          />
                        )}
                      </div>
                      {edu.description && (
                        <p className="text-sm text-muted-foreground mt-3">{edu.description}</p>
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
          {educations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No education entries</p>
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
            educations.map((edu) => (
              <Card key={edu.id} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  {edu.logo_url ? (
                    <img
                      src={edu.logo_url}
                      alt={edu.logo_alt || edu.institution}
                      className="h-12 w-12 rounded object-contain bg-muted"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {edu.institution_short || edu.institution}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {edu.start_date} - {edu.end_date || "Ongoing"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingItem(edu)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(edu.id)}
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
