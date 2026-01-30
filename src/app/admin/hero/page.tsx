"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Save, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { HeroCarousel } from "@/types/database.types";

export default function HeroAdminPage() {
  // Memoize supabase client
  const supabase = useMemo(() => createClient(), []);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [items, setItems] = useState<HeroCarousel[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<HeroCarousel> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all hero carousel items
  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from("hero_carousel")
        .select("*")
        .order("line_number, order_index", { ascending: true });
      
      if (error) {
        console.error("Error fetching hero items:", error);
        toast.error(`Failed to load: ${error.message}`);
      }
      
      if (data) {
        setItems(data);
      }
      setIsLoading(false);
    }
    fetchItems();
  }, [supabase]);

  const handleSave = useCallback(async () => {
    if (!editingItem || !editingItem.text?.trim()) {
      toast.error("Text is required");
      return;
    }
    
    if (!editingItem.line_number || editingItem.line_number < 1 || editingItem.line_number > 2) {
      toast.error("Line must be 1 or 2");
      return;
    }
    
    setIsSaving(true);
    try {
      if (editingItem.id) {
        // Update existing
        const { data, error } = await supabase
          .from("hero_carousel")
          .update({
            text: editingItem.text,
            emoji: editingItem.emoji || null,
            line_number: editingItem.line_number,
            order_index: editingItem.order_index || 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id)
          .select()
          .single();

        if (error) throw error;
        
        if (data) {
          setItems(prev => 
            prev.map(i => i.id === editingItem.id ? data : i)
          );
        }
      } else {
        // Insert new
        const maxOrderInLine = items
          .filter(i => i.line_number === editingItem.line_number)
          .reduce((max, i) => Math.max(max, i.order_index), 0);
          
        const { data, error } = await supabase
          .from("hero_carousel")
          .insert([{ 
            text: editingItem.text,
            emoji: editingItem.emoji || null,
            line_number: editingItem.line_number,
            order_index: maxOrderInLine + 1,
            is_active: true
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setItems(prev => [...prev, data]);
        }
      }

      toast.success(editingItem.id ? "Updated!" : "Added!");
      setEditingItem(null);
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error?.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [editingItem, items, supabase]);

  const handleDelete = useCallback(async () => {
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
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to delete");
    }
  }, [deleteId, supabase]);

  // Group by line - memoized (must be before early return)
  const line1Items = useMemo(() => 
    items.filter(i => i.line_number === 1).sort((a, b) => a.order_index - b.order_index), 
    [items]
  );
  const line2Items = useMemo(() => 
    items.filter(i => i.line_number === 2).sort((a, b) => a.order_index - b.order_index), 
    [items]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 tracking-tight border-b-4 border-black inline-block pb-1">
          Hero Carousel
        </h1>
        <p className="text-muted-foreground mt-4">
          Manage hero section text animations (2 lines, multiple items per line)
        </p>
      </div>

      {/* Add Button */}
      <Dialog open={editingItem !== null && !editingItem.id} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setEditingItem({ line_number: 1, order_index: 0, is_active: true })}
            className="mb-6 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </DialogTrigger>
      </Dialog>

      {/* Line 1 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          📝 Line 1
          <span className="text-sm text-muted-foreground font-normal">
            ({line1Items.length} items)
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {line1Items.map((item) => (
            <Card
              key={item.id}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-3xl mb-2">{item.emoji || "💬"}</div>
                    <div className="font-bold text-lg mb-1">{item.text}</div>
                    <div className="text-xs text-muted-foreground">
                      Order: {item.order_index}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingItem(item)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(item.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {line1Items.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No items in Line 1
            </div>
          )}
        </div>
      </div>

      {/* Line 2 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          📝 Line 2
          <span className="text-sm text-muted-foreground font-normal">
            ({line2Items.length} items)
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {line2Items.map((item) => (
            <Card
              key={item.id}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-3xl mb-2">{item.emoji || "💬"}</div>
                    <div className="font-bold text-lg mb-1">{item.text}</div>
                    <div className="text-xs text-muted-foreground">
                      Order: {item.order_index}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingItem(item)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(item.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {line2Items.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No items in Line 2
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingItem !== null} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? "Edit" : "Add"} Hero Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="text">Text *</Label>
              <Input
                id="text"
                value={editingItem?.text || ""}
                onChange={(e) => setEditingItem(prev => ({ ...prev, text: e.target.value }))}
                placeholder="e.g. Web Developer"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="emoji">Icon/Emoji</Label>
              <IconPicker
                value={editingItem?.emoji || ""}
                onChange={(value) => setEditingItem(prev => ({ ...prev, emoji: value }))}
                placeholder="Select icon or emoji"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select from icon library or paste emoji (Win + .)
              </p>
            </div>

            <div>
              <Label htmlFor="line_number">Line *</Label>
              <Select
                value={editingItem?.line_number?.toString() || "1"}
                onValueChange={(value) => setEditingItem(prev => ({ ...prev, line_number: parseInt(value) }))}
              >
                <SelectTrigger id="line_number" className="mt-1">
                  <SelectValue placeholder="Select line" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Line 1</SelectItem>
                  <SelectItem value="2">Line 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="order_index">Display Order</Label>
              <Input
                id="order_index"
                type="number"
                value={editingItem?.order_index || 0}
                onChange={(e) => setEditingItem(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                min="0"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingItem(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hero Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the hero carousel item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
