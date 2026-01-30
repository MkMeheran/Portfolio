"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker-optimized";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  GripVertical, Wrench, Square, RectangleHorizontal 
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { Tool } from "@/types/database.types";

// Grid size options
const GRID_SIZES = [
  { value: "1x1", label: "Small (1x1)", icon: Square },
  { value: "2x1", label: "Wide (2x1)", icon: RectangleHorizontal },
  { value: "1x2", label: "Tall (1x2)", icon: RectangleHorizontal },
  { value: "2x2", label: "Large (2x2)", icon: Square },
];

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

export default function ToolsAdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Tool> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch all tools
  useEffect(() => {
    async function fetchTools() {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (data) {
        setTools(data);
      }
      setIsLoading(false);
    }
    fetchTools();
  }, [supabase]);

  const handleSave = async () => {
    // Validation
    if (!editingItem || !editingItem.name?.trim()) {
      toast.error("Tool name is required");
      return;
    }
    
    console.log("Saving tool with data:", editingItem);
    
    setIsSaving(true);
    try {
      if (editingItem.id) {
        // Update existing tool - only send fields that exist in database
        const updateData: any = {
          name: editingItem.name,
        };
        
        // Add optional fields only if they have values
        if (editingItem.icon) updateData.icon = editingItem.icon;
        if (editingItem.icon_url) updateData.icon_url = editingItem.icon_url;
        if (editingItem.icon_alt) updateData.icon_alt = editingItem.icon_alt;
        if (editingItem.category) updateData.category = editingItem.category;
        if (editingItem.url) updateData.url = editingItem.url;
        if (editingItem.proficiency !== undefined) updateData.proficiency = editingItem.proficiency;
        if (editingItem.grid_size) updateData.grid_size = editingItem.grid_size;
        if (editingItem.bg_color) updateData.bg_color = editingItem.bg_color;
        if (editingItem.display_order !== undefined) updateData.display_order = editingItem.display_order;

        console.log("Sending update data:", updateData);

        const { data, error } = await supabase
          .from("tools")
          .update(updateData)
          .eq("id", editingItem.id)
          .select()
          .single();

        if (error) {
          console.error("Update error details:", error);
          throw error;
        }
        
        if (data) {
          setTools(prev => 
            prev.map(t => t.id === editingItem.id ? data : t)
          );
        }
      } else {
        // Insert new tool
        const newOrder = tools.length > 0 
          ? Math.max(...tools.map(t => t.display_order)) + 1 
          : 0;
        
        const insertData: any = {
          name: editingItem.name,
          display_order: editingItem.display_order || newOrder,
        };
        
        // Add optional fields
        if (editingItem.icon) insertData.icon = editingItem.icon;
        if (editingItem.icon_url) insertData.icon_url = editingItem.icon_url;
        if (editingItem.icon_alt) insertData.icon_alt = editingItem.icon_alt;
        if (editingItem.category) insertData.category = editingItem.category;
        if (editingItem.url) insertData.url = editingItem.url;
        if (editingItem.proficiency !== undefined) insertData.proficiency = editingItem.proficiency;
        if (editingItem.grid_size) insertData.grid_size = editingItem.grid_size;
        if (editingItem.bg_color) insertData.bg_color = editingItem.bg_color;
        
        console.log("Sending insert data:", insertData);
          
        const { data, error } = await supabase
          .from("tools")
          .insert([insertData])
          .select()
          .single();

        if (error) {
          console.error("Insert error details:", error);
          throw error;
        }
        
        if (data) {
          setTools(prev => [...prev, data]);
        }
      }

      toast.success(editingItem.id ? "Tool updated!" : "Tool added!");
      setEditingItem(null);
      router.refresh();
    } catch (error: any) {
      console.error("Save error:", error);
      
      // More detailed error message
      let errorMessage = "Failed to save tool";
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.code) {
        errorMessage = `Database error: ${error.code}`;
      } else if (error?.details) {
        errorMessage = error.details;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("tools")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      
      setTools(prev => prev.filter(t => t.id !== deleteId));
      toast.success("Deleted!");
      setDeleteId(null);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.message || "Failed to delete tool");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Group tools by category for preview
  const groupedTools = tools.reduce((acc, tool) => {
    const cat = tool.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight border-b-4 border-black inline-block pb-1">Tools & Software</h1>
          <p className="text-muted-foreground mt-2">Manage the tools you use</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            disabled={tools.length === 0}
            className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold disabled:opacity-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "List" : "Preview"}
          </Button>
          <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem({})} className="bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Add Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingItem?.id ? "Edit Tool" : "Add New Tool"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tool Name *</Label>
                  <Input
                    id="name"
                    value={editingItem?.name || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Python, QGIS"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <IconPicker
                    value={editingItem?.icon || ""}
                    onChange={(value) => setEditingItem(prev => ({ ...prev, icon: value }))}
                    placeholder="Select an icon..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Grid Size</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {GRID_SIZES.map((size) => (
                      <button
                        key={size.value}
                        type="button"
                        onClick={() => setEditingItem(prev => ({ ...prev, grid_size: size.value }))}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          editingItem?.grid_size === size.value
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-muted-foreground/30"
                        }`}
                      >
                        <size.icon className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-xs">{size.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Background Color (Skill Page)</Label>
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
                  <Label>Background Color (Homepage)</Label>
                  <div className="flex flex-wrap gap-2">
                    {BG_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditingItem(prev => ({ ...prev, home_bg_color: color.value }))}
                        className={`h-8 w-8 rounded-full ${color.class} border-2 transition-all ${
                          editingItem?.home_bg_color === color.value 
                            ? "border-primary scale-110" 
                            : "border-transparent hover:scale-105"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={editingItem?.category || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. programming, gis, office, design"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon_alt">Icon Alt Text</Label>
                  <Input
                    id="icon_alt"
                    value={editingItem?.icon_alt || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, icon_alt: e.target.value }))}
                    placeholder="e.g. Python Programming Language"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={editingItem?.display_order || 0}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                    placeholder="e.g. 1, 2, 3"
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
        // Preview Mode - Bento Grid by Category
        <div className="space-y-8">
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <div className="grid grid-cols-4 gap-4 auto-rows-[100px]">
                {categoryTools.map((tool) => {
                  const gridClass = 
                    tool.grid_size === "2x2" ? "col-span-2 row-span-2" :
                    tool.grid_size === "2x1" ? "col-span-2 row-span-1" :
                    tool.grid_size === "1x2" ? "col-span-1 row-span-2" :
                    "col-span-1 row-span-1";
                  
                  return (
                    <Card key={tool.id} className={`overflow-hidden ${gridClass}`}>
                      <CardContent className="h-full flex flex-col items-center justify-center p-4 text-center hover:bg-muted/50 transition-colors">
                        {(() => {
                          const IconComponent = tool.icon && (LucideIcons as any)[tool.icon];
                          const iconSizeClass = 
                            tool.grid_size === "2x2" ? "h-16 w-16" :
                            tool.grid_size === "2x1" || tool.grid_size === "1x2" ? "h-12 w-12" :
                            "h-10 w-10";
                          
                          if (IconComponent) {
                            return <IconComponent className={`${iconSizeClass} mb-2 text-foreground`} />;
                          } else if (tool.icon_url) {
                            return (
                              <div className={`relative ${iconSizeClass} mb-2`}>
                                <Image
                                  src={tool.icon_url}
                                  alt={tool.icon_alt || tool.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            );
                          } else {
                            return (
                              <div className={`${iconSizeClass} rounded bg-muted flex items-center justify-center mb-2`}>
                                <Wrench className={`${tool.grid_size === "2x2" ? "h-8 w-8" : "h-5 w-5"}`} />
                              </div>
                            );
                          }
                        })()}
                        <p className={`font-medium ${tool.grid_size === "2x2" ? "text-base" : "text-sm"}`}>
                          {tool.name}
                        </p>
                        {tool.grid_size === "2x2" && tool.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {tool.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List Mode
        <div className="space-y-4">
          {tools.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No tools found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setEditingItem({})}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Tool
                </Button>
              </CardContent>
            </Card>
          ) : (
            tools.map((tool) => (
              <Card key={tool.id} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  {(() => {
                    const IconComponent = tool.icon && (LucideIcons as any)[tool.icon];
                    if (IconComponent) {
                      return (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                          <IconComponent className="h-5 w-5 text-foreground" />
                        </div>
                      );
                    } else if (tool.icon_url) {
                      return (
                        <div className="relative h-10 w-10 rounded bg-muted overflow-hidden shrink-0">
                          <Image
                            src={tool.icon_url}
                            alt={tool.icon_alt || tool.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                          <Wrench className="h-5 w-5" />
                        </div>
                      );
                    }
                  })()}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{tool.name}</h3>
                      {tool.grid_size && tool.grid_size !== "1x1" && (
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {tool.grid_size}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {tool.category || "Other"}
                      {tool.proficiency && ` • ${tool.proficiency}`}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingItem(tool)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(tool.id)}
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
              This tool will be permanently deleted. This action cannot be undone.
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
