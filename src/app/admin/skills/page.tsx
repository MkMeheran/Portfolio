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
import { Separator } from "@/components/ui/separator";
import { IconPicker } from "@/components/ui/icon-picker-optimized";
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
  ChevronDown, ExternalLink, GripVertical
} from "lucide-react";
import { toast } from "sonner";
import type { Skill, Certificate } from "@/types/database.types";

// Color Picker Options
const BG_COLORS = [
  { name: "Amber", class: "bg-amber-100", value: "amber" },
  { name: "Blue", class: "bg-blue-100", value: "blue" },
  { name: "Green", class: "bg-green-100", value: "green" },
  { name: "Purple", class: "bg-purple-100", value: "purple" },
  { name: "Pink", class: "bg-pink-100", value: "pink" },
  { name: "Cyan", class: "bg-cyan-100", value: "cyan" },
  { name: "Orange", class: "bg-orange-100", value: "orange" },
  { name: "Lime", class: "bg-lime-100", value: "lime" },
  { name: "Rose", class: "bg-rose-100", value: "rose" },
  { name: "Slate", class: "bg-slate-100", value: "slate" },
];

export default function SkillsAdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [skills, setSkills] = useState<(Skill & { certificates?: Certificate[] })[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Skill> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<Certificate> & { skill_id?: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteCertId, setDeleteCertId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());

  // Fetch all skills with certificates
  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from("skills")
        .select(`
          *,
          certificates (*)
        `)
        .order("display_order", { ascending: true });
      
      if (data) {
        setSkills(data);
      }
      setIsLoading(false);
    }
    fetchSkills();
  }, [supabase]);

  const handleSaveSkill = async () => {
    if (!editingItem) return;
    
    setIsSaving(true);
    try {
      if (editingItem.id) {
        const { error } = await supabase
          .from("skills")
          .update({
            ...editingItem,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        
        setSkills(prev => 
          prev.map(s => s.id === editingItem.id ? { ...s, ...editingItem } as typeof s : s)
        );
      } else {
        const newOrder = skills.length > 0 
          ? Math.max(...skills.map(s => s.display_order)) + 1 
          : 0;
          
        const { data, error } = await supabase
          .from("skills")
          .insert([{ ...editingItem, display_order: newOrder }])
          .select()
          .single();

        if (error) throw error;
        if (data) setSkills(prev => [...prev, { ...data, certificates: [] }]);
      }

      toast.success(editingItem.id ? "Updated!" : "Added!");
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      console.error("Error saving skill:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCertificate = async () => {
    if (!editingCert || !editingCert.skill_id) return;
    
    setIsSaving(true);
    try {
      if (editingCert.id) {
        const { error } = await supabase
          .from("certificates")
          .update({
            ...editingCert,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCert.id);

        if (error) throw error;
        
        setSkills(prev => prev.map(s => {
          if (s.id === editingCert.skill_id) {
            return {
              ...s,
              certificates: s.certificates?.map(c => 
                c.id === editingCert.id ? { ...c, ...editingCert } as Certificate : c
              )
            };
          }
          return s;
        }));
      } else {
        const skill = skills.find(s => s.id === editingCert.skill_id);
        const newOrder = skill?.certificates?.length 
          ? Math.max(...skill.certificates.map(c => c.display_order)) + 1 
          : 0;
          
        const { data, error } = await supabase
          .from("certificates")
          .insert([{ ...editingCert, display_order: newOrder }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSkills(prev => prev.map(s => {
            if (s.id === editingCert.skill_id) {
              return {
                ...s,
                certificates: [...(s.certificates || []), data]
              };
            }
            return s;
          }));
        }
      }

      toast.success(editingCert.id ? "Certificate updated!" : "Certificate added!");
      setEditingCert(null);
      router.refresh();
    } catch (error) {
      console.error("Error saving certificate:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      
      setSkills(prev => prev.filter(s => s.id !== deleteId));
      toast.success("Deleted!");
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting skill:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!deleteCertId) return;
    
    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", deleteCertId);

      if (error) throw error;
      
      setSkills(prev => prev.map(s => ({
        ...s,
        certificates: s.certificates?.filter(c => c.id !== deleteCertId)
      })));
      toast.success("Certificate deleted!");
      setDeleteCertId(null);
    } catch (error) {
      console.error("Error deleting certificate:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete";
      toast.error(errorMessage);
    }
  };

  const toggleSkillExpanded = (skillId: string) => {
    setExpandedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skillId)) {
        newSet.delete(skillId);
      } else {
        newSet.add(skillId);
      }
      return newSet;
    });
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
          <h1 className="text-4xl font-black mb-2 tracking-tight border-b-4 border-black inline-block pb-1">Skills & Certificates</h1>
          <p className="text-muted-foreground mt-2">Manage your skills and certifications</p>
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
                Add New Skill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem?.id ? "Edit Skill" : "Add New Skill"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Skill Name *</Label>
                    <Input
                      id="name"
                      value={editingItem?.name || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g: GIS & Remote Sensing"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editingItem?.category || ""}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g: Technical"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Lucide)</Label>
                  <IconPicker
                    value={editingItem?.icon || ""}
                    onChange={(value) => setEditingItem(prev => ({ ...prev, icon: value }))}
                    placeholder="Select an icon..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {BG_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditingItem(prev => ({ ...prev, bg_color: color.value }))}
                        className={`h-8 w-8 rounded-full ${color.class} border-2 transition-all ${
                          editingItem?.bg_color === color.value 
                            ? "border-primary scale-110" 
                            : "border-transparent hover:scale-105"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub_skills">Sub-Skills</Label>
                  <Input
                    id="sub_skills"
                    value={editingItem?.sub_skills?.join(", ") || ""}
                    onChange={(e) => setEditingItem(prev => ({ 
                      ...prev, 
                      sub_skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    }))}
                    placeholder="ArcGIS, QGIS, Python (separated by commas)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingItem?.description || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed information about this skill..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="has_certificates"
                    checked={editingItem?.has_certificates || false}
                    onCheckedChange={(checked) => setEditingItem(prev => ({ ...prev, has_certificates: checked }))}
                  />
                  <Label htmlFor="has_certificates">Has Certificates</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSkill} disabled={isSaving}>
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

      {/* Certificate Edit Dialog */}
      <Dialog open={!!editingCert} onOpenChange={(open) => !open && setEditingCert(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCert?.id ? "Edit Certificate" : "Add New Certificate"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cert_title">Certificate Name *</Label>
              <Input
                id="cert_title"
                value={editingCert?.title || ""}
                onChange={(e) => setEditingCert(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g: Google Data Analytics"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert_issuer">Issuing Organization</Label>
              <Input
                id="cert_issuer"
                value={editingCert?.issuer || ""}
                onChange={(e) => setEditingCert(prev => ({ ...prev, issuer: e.target.value }))}
                placeholder="e.g: Google, Coursera"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cert_credential_id">Credential ID</Label>
                <Input
                  id="cert_credential_id"
                  value={editingCert?.credential_id || ""}
                  onChange={(e) => setEditingCert(prev => ({ ...prev, credential_id: e.target.value }))}
                  placeholder="e.g: ABC123XYZ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert_credential_url">Credential URL</Label>
                <Input
                  id="cert_credential_url"
                  value={editingCert?.credential_url || ""}
                  onChange={(e) => setEditingCert(prev => ({ ...prev, credential_url: e.target.value }))}
                  placeholder="https://credential.link"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cert_issue_date">Issue Date</Label>
                <Input
                  id="cert_issue_date"
                  value={editingCert?.issue_date || ""}
                  onChange={(e) => setEditingCert(prev => ({ ...prev, issue_date: e.target.value }))}
                  placeholder="e.g: Jan 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert_expiry_date">Expiry Date</Label>
                <Input
                  id="cert_expiry_date"
                  value={editingCert?.expiry_date || ""}
                  onChange={(e) => setEditingCert(prev => ({ ...prev, expiry_date: e.target.value }))}
                  placeholder="e.g: Jan 2027 or leave empty"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Certificate Image</Label>
              <ImageUploader
                value={editingCert?.image_url || ""}
                onChange={(url) => setEditingCert(prev => ({ ...prev, image_url: url }))}
                preset="certificate"
                folder="certificates"
                alt={editingCert?.image_alt || ""}
                onAltChange={(alt) => setEditingCert(prev => ({ ...prev, image_alt: alt }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCert(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCertificate} disabled={isSaving}>
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

      {showPreview ? (
        // Preview Mode
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    {skill.category && (
                      <CardDescription>{skill.category}</CardDescription>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {skill.sub_skills && skill.sub_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {skill.sub_skills.map((sub, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                )}
                {skill.has_certificates && skill.certificates && skill.certificates.length > 0 && (
                  <div className="space-y-3 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground">
                      Certificates ({skill.certificates.length})
                    </p>
                    {skill.certificates.map((cert, i) => (
                      <div key={cert.id}>
                        {i > 0 && <Separator className="my-3" />}
                        <div className="space-y-2">
                          <p className="font-medium text-sm">{cert.title}</p>
                          {cert.credential_id && (
                            <p className="text-xs text-muted-foreground">
                              ID: {cert.credential_url ? (
                                <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {cert.credential_id}
                                </a>
                              ) : cert.credential_id}
                            </p>
                          )}
                          {cert.image_url && (
                            <img
                              src={cert.image_url}
                              alt={cert.image_alt || cert.title}
                              className="w-full rounded-md border"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List Mode
        <div className="space-y-4">
          {skills.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No skills</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setEditingItem({})}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Skill
                </Button>
              </CardContent>
            </Card>
          ) : (
            skills.map((skill) => (
              <Collapsible
                key={skill.id}
                open={expandedSkills.has(skill.id)}
                onOpenChange={() => toggleSkillExpanded(skill.id)}
              >
                <Card>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-4">
                      <div className="cursor-move text-muted-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{skill.name}</h3>
                          {skill.has_certificates && (
                            <Badge variant="secondary" className="text-xs">
                              {skill.certificates?.length || 0} Certificates
                            </Badge>
                          )}
                        </div>
                        {skill.sub_skills && skill.sub_skills.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {skill.sub_skills.slice(0, 3).map((sub, i) => (
                              <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                {sub}
                              </span>
                            ))}
                            {skill.sub_skills.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{skill.sub_skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {skill.has_certificates && (
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSkills.has(skill.id) ? "rotate-180" : ""}`} />
                            </Button>
                          </CollapsibleTrigger>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingItem(skill)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(skill.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {skill.has_certificates && (
                      <CollapsibleContent>
                        <div className="border-t bg-muted/30 p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-sm">Certificates</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCert({ skill_id: skill.id })}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          
                          {skill.certificates && skill.certificates.length > 0 ? (
                            <div className="space-y-3">
                              {skill.certificates.map((cert) => (
                                <div key={cert.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                                  {cert.image_url && (
                                    <img
                                      src={cert.image_url}
                                      alt={cert.image_alt || cert.title}
                                      className="h-12 w-16 rounded object-cover shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{cert.title}</p>
                                    {cert.issuer && (
                                      <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                                    )}
                                    {cert.credential_id && (
                                      <p className="text-xs text-muted-foreground">
                                        ID: {cert.credential_id}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-1">
                                    {cert.credential_url && (
                                      <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => setEditingCert({ ...cert, skill_id: skill.id })}
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive hover:text-destructive"
                                      onClick={() => setDeleteCertId(cert.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No certificates
                            </p>
                          )}
                        </div>
                      </CollapsibleContent>
                    )}
                  </CardContent>
                </Card>
              </Collapsible>
            ))
          )}
        </div>
      )}

      {/* Delete Skill Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This skill and all its certificates will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSkill} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Certificate Confirmation */}
      <AlertDialog open={!!deleteCertId} onOpenChange={(open) => !open && setDeleteCertId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              This certificate will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCertificate} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
