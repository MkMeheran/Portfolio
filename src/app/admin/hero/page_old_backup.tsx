"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
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
import { 
  Save, Loader2, Plus, Pencil, Trash2, Eye, 
  GripVertical, Sparkles, ChevronLeft, ChevronRight 
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { HeroCarousel } from "@/types/database.types";

export default function HeroAdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [items, setItems] = useState<HeroCarousel[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<HeroCarousel> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Fetch all hero carousel items
  useEffect(() => {
    async function fetchItems() {
      console.log("Fetching hero carousel items...");
      const { data, error } = await supabase
        .from("hero_carousel")
        .select("*")
        .order("display_order", { ascending: true });
      
      console.log("Fetch response:", { data, error, count: data?.length });
      
      if (error) {
        console.error("Error fetching hero items:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast.error(`Failed to load: ${error.message}`);
      }
      
      if (data) {
        console.log("Fetched hero items:", data);
        setItems(data);
      }
      setIsLoading(false);
    }
    fetchItems();
  }, [supabase]);

  const handleSave = async () => {
    if (!editingItem || !editingItem.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    
    setIsSaving(true);
    try {
      if (editingItem.id) {
        const { data, error } = await supabase
          .from("hero_carousel")
          .update({
            title: editingItem.title,
            icon: editingItem.icon || null,
            display_order: editingItem.display_order || 0,
            is_active: editingItem.is_active !== false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id)
          .select()
          .single();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        if (data) {
          setItems(prev => 
            prev.map(i => i.id === editingItem.id ? data : i)
          );
        }
      } else {
        const newOrder = items.length > 0 
          ? Math.max(...items.map(i => i.display_order)) + 1 
          : 0;
          
        const insertData = { 
          title: editingItem.title,
          icon: editingItem.icon || null,
          display_order: newOrder,
          is_active: true
        };
        
        console.log("Inserting data:", insertData);
        
        const { data, error } = await supabase
          .from("hero_carousel")
          .insert([insertData])
          .select()
          .single();

        console.log("Insert response:", { data, error });

        if (error) {
          console.error("Insert error details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            fullError: JSON.stringify(error, null, 2)
          });
          throw error;
        }
        if (data) {
          setItems(prev => [...prev, data]);
        }
      }

      toast.success(editingItem.id ? "Updated!" : "Added!");
      setEditingItem(null);
    } catch (error: any) {
      console.error("Save error full:", {
        error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        stack: error?.stack,
        stringified: JSON.stringify(error, null, 2)
      });
      toast.error(error?.message || error?.hint || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from("hero_carousel")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      
      setItems(prev => prev.filter(i => i.id !== deleteId));
      toast.success("Deleted!");
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete");
    }
  };

  const nextPreview = () => {
    setPreviewIndex((prev) => (prev + 1) % items.length);
  };

  const prevPreview = () => {
    setPreviewIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentPreviewItem = items[previewIndex];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight border-b-4 border-black inline-block pb-1">Hero Carousel</h1>
          <p className="text-muted-foreground mt-2">Manage the homepage hero slider</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            disabled={items.length === 0}
            className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold disabled:opacity-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "List" : "Preview"}
          </Button>
          <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem({})} className="bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Add New Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingItem?.id ? "Edit Role" : "Add New Role"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Role Name *</Label>
                  <Input
                    id="title"
                    value={editingItem?.title || ""}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Web Developer, GIS Analyst"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Icon (Optional)</Label>
                  <IconPicker
                    value={editingItem?.icon || ""}
                    onChange={(value) => setEditingItem(prev => ({ ...prev, icon: value }))}
                    placeholder="Select an icon..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
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

      {showPreview && currentPreviewItem ? (
        // Preview Mode - Carousel Preview
        <Card className="overflow-hidden">
          <div className="relative aspect-[21/9] bg-gradient-to-r from-amber-200 to-orange-100">
            {currentPreviewItem.image_url && (
              <Image
                src={currentPreviewItem.image_url}
                alt={currentPreviewItem.image_alt || currentPreviewItem.title}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="px-12 max-w-xl text-white">
                <h1 className="text-4xl font-bold mb-2">{currentPreviewItem.title}</h1>
                {currentPreviewItem.subtitle && (
                  <p className="text-xl mb-4 text-white/90">{currentPreviewItem.subtitle}</p>
                )}
                {currentPreviewItem.description && (
                  <p className="text-white/80 mb-6">{currentPreviewItem.description}</p>
                )}
                {currentPreviewItem.button_text && (
                  <Button variant="secondary">
                    {currentPreviewItem.button_text}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Navigation */}
            {items.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
                  onClick={prevPreview}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
                  onClick={nextPreview}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                
                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {items.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        idx === previewIndex ? "bg-white w-6" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            Slide {previewIndex + 1} / {items.length}
          </CardContent>
        </Card>
      ) : (
        // List Mode
        <div className="space-y-4">
          {items.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hero slides</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setEditingItem({})}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Slide
                </Button>
              </CardContent>
            </Card>
          ) : (
            items.map((item, index) => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  <div className="text-lg font-bold text-muted-foreground w-8">
                    {index + 1}
                  </div>
                  
                  {item.image_url ? (
                    <div className="relative h-16 w-28 rounded overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.image_alt || item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-28 rounded bg-gradient-to-r from-amber-200 to-orange-100 flex items-center justify-center shrink-0">
                      <Sparkles className="h-6 w-6 text-amber-600" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      {!item.is_active && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-sm text-muted-foreground truncate">
                        {item.subtitle}
                      </p>
                    )}
                    {item.button_text && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Button: {item.button_text}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(item.id)}
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
              This slide will be permanently deleted. This action cannot be undone.
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
