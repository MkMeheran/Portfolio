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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, Eye, User, Link as LinkIcon, Globe, Search } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { Profile } from "@/types/database.types";

export default function ProfileAdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: "",
    title: "",
    subtitle: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
    avatar_url: "",
    cover_url: "",
    github_url: "",
    linkedin_url: "",
    facebook_url: "",
    twitter_url: "",
    whatsapp_url: "",
    meta_title: "",
    meta_description: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .single();
      
      if (data) {
        setFormData(data);
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, [supabase]);

  const handleChange = (field: keyof Profile, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from("profile")
        .select("id")
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from("profile")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
      } else {
        // Insert
        const { error } = await supabase
          .from("profile")
          .insert([formData]);

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
      }

      toast.success("Profile saved!");
      router.refresh();
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <AdminHeader 
          title="Profile" 
          description="Edit your personal information" 
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      {showPreview ? (
        // Preview Mode
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              {/* Cover */}
              {formData.cover_url ? (
                <div className="relative h-32 rounded-t-lg overflow-hidden">
                  <Image
                    src={formData.cover_url}
                    alt={formData.name || "Cover"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-r from-amber-200 to-orange-100 rounded-t-lg" />
              )}
              
              {/* Avatar */}
              <div className="absolute left-6 -bottom-12">
                <div className="relative h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-muted">
                  {formData.avatar_url ? (
                    <Image
                      src={formData.avatar_url}
                      alt={formData.name || "Avatar"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-16 space-y-2">
              <h2 className="text-2xl font-bold">{formData.name || "Name"}</h2>
              <p className="text-lg text-muted-foreground">{formData.title || "Title"}</p>
              <p className="text-sm text-muted-foreground">{formData.subtitle}</p>
              <p className="text-sm">{formData.location}</p>
              <p className="mt-4 text-sm whitespace-pre-wrap">{formData.bio}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">
              <User className="h-4 w-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="images">
              <LinkIcon className="h-4 w-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="social">
              <Globe className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Search className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your name, title and bio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="e.g.: Web Developer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle || ""}
                    onChange={(e) => handleChange("subtitle", e.target.value)}
                    placeholder="e.g.: KUET | Student ID: 2417012"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ""}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Write something about yourself..."
                    rows={6}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="e.g.: Dhaka, Bangladesh"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+880 1XXX XXXXXX"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images */}
          <TabsContent value="images">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Your avatar image</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    value={formData.avatar_url || ""}
                    onChange={(url) => handleChange("avatar_url", url)}
                    preset="avatar"
                    folder="profile"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                  <CardDescription>Profile background image</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    value={formData.cover_url || ""}
                    onChange={(url) => handleChange("cover_url", url)}
                    preset="cover"
                    folder="profile"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Links */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Your social profile links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={formData.github_url || ""}
                      onChange={(e) => handleChange("github_url", e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin_url || ""}
                      onChange={(e) => handleChange("linkedin_url", e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.facebook_url || ""}
                      onChange={(e) => handleChange("facebook_url", e.target.value)}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter / X</Label>
                    <Input
                      id="twitter"
                      value={formData.twitter_url || ""}
                      onChange={(e) => handleChange("twitter_url", e.target.value)}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp_url || ""}
                    onChange={(e) => handleChange("whatsapp_url", e.target.value)}
                    placeholder="https://wa.link/xxxxx"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Search engine optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title || ""}
                    onChange={(e) => handleChange("meta_title", e.target.value)}
                    placeholder="Page title (up to 60 characters)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(formData.meta_title || "").length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description || ""}
                    onChange={(e) => handleChange("meta_description", e.target.value)}
                    placeholder="Brief description (up to 160 characters)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(formData.meta_description || "").length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
