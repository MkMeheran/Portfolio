"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types/database.types";

export default function AboutAdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [bio, setBio] = useState("");

  // Fetch profile bio
  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("profile")
        .select("bio")
        .single();
      
      if (data) {
        setBio(data.bio || "");
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, [supabase]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from("profile")
        .select("id")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("profile")
          .update({
            bio: bio,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        toast.success("About section saved!");
        router.refresh();
      } else {
        toast.error("Profile not found. Please create a profile first.");
      }
    } catch (error) {
      console.error("Save error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
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
    <div className="space-y-6">
      <AdminHeader
        title="About Section"
        description="Edit your bio and about me content"
        actions={
          <div className="flex gap-2">
            <Button
              variant={showPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            {!showPreview && (
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                size="sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            )}
          </div>
        }
      />

      {showPreview ? (
        // Preview Mode
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How your bio will appear</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-stone max-w-none">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{bio || "No bio content yet..."}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Biography / About Me
            </CardTitle>
            <CardDescription>
              Write about yourself, your background, skills, and interests. Supports line breaks and formatting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Your Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people about yourself, your journey, expertise, and what drives you..."
                className="min-h-[400px] resize-y font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Press Enter for new lines. Keep it concise yet informative.
              </p>
            </div>

            {/* Quick formatting tips */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Formatting Tips:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use line breaks to separate paragraphs</li>
                <li>• Keep paragraphs short for better readability</li>
                <li>• Mention your key skills and experiences</li>
                <li>• Add personality - what makes you unique?</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
