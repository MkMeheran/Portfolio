"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Eye, User, Link as LinkIcon, Globe, Search, Settings } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { Profile } from "@/types/database.types";

// ─── dynamic imports ─────────────────────────────────────────────────────────
const ImageUploader = dynamic(
  () => import("@/components/admin/image-uploader").then((mod) => mod.ImageUploader),
  {
    ssr: false,
    loading: () => <div className="text-sm font-black text-stone-500 font-[family-name:var(--font-space-mono)]">Loading uploader...</div>,
  }
);

// ─── NES shadow tokens ────────────────────────────────────────────────────────
const nesRaised  = "inset -3px -3px 0px #6b6b6b, inset 3px 3px 0px #e0d8cc";
const nesPressed = "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc";

// ─── Reusable NES-style input wrapper ─────────────────────────────────────────
const nesInputCls =
  "w-full px-3 py-2.5 text-base font-medium text-stone-900 bg-stone-50 " +
  "border-2 border-stone-900 rounded focus:outline-none focus:border-amber-600 " +
  "placeholder:text-stone-400 font-[family-name:var(--font-space)]";

// ─── Field label ──────────────────────────────────────────────────────────────
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

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("profile")
          .insert([formData]);

        if (error) throw error;
      }

      toast.success("Profile saved!");
      router.refresh();
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Loading screen ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div
          className="flex items-center justify-center h-14 w-14 bg-amber-100 border-2 border-stone-900 rounded"
          style={{ boxShadow: nesRaised }}
        >
          <Loader2 className="h-7 w-7 animate-spin text-stone-700" />
        </div>
        <p className="text-sm font-black text-stone-600 font-[family-name:var(--font-space-mono)]">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-300 pb-8">
      <div className="max-w-3xl mx-auto px-2 sm:px-4 pt-4 space-y-6">

        {/* ── Page header ── */}
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
              <Settings className="h-6 w-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900 font-[family-name:var(--font-space-mono)] leading-tight">
                Profile Settings
              </h1>
              <p className="text-sm font-medium text-stone-600 font-[family-name:var(--font-space)]">
                Edit your personal information
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-2 bg-stone-100 text-stone-900
                         text-sm font-black border-2 border-stone-900 rounded
                         font-[family-name:var(--font-space-mono)] transition-transform active:scale-95"
              style={{ boxShadow: nesRaised }}
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-stone-900
                         text-sm font-black border-2 border-stone-900 rounded
                         font-[family-name:var(--font-space-mono)] transition-transform active:scale-95 disabled:opacity-60"
              style={{ boxShadow: nesRaised }}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          </div>
        </div>

        {/* ════════════════════ PREVIEW MODE ════════════════════ */}
        {showPreview ? (
          <div
            className="border-2 border-stone-900 rounded bg-stone-100 overflow-hidden"
            style={{ boxShadow: nesRaised }}
          >
            <div className="relative">
              {/* Cover */}
              <div className="h-32 sm:h-48 border-b-2 border-stone-900 bg-stone-200">
                {formData.cover_url ? (
                  <Image
                    src={formData.cover_url}
                    alt={formData.name || "Cover"}
                    width={1200}
                    height={320}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-amber-300 to-orange-300" />
                )}
              </div>
              
              {/* Avatar */}
              <div className="absolute left-6 -bottom-12">
                <div 
                  className="h-24 w-24 sm:h-28 sm:w-28 bg-stone-100 border-2 border-stone-900 rounded flex items-center justify-center overflow-hidden"
                  style={{ boxShadow: nesRaised }}
                >
                  {formData.avatar_url ? (
                    <Image
                      src={formData.avatar_url}
                      alt={formData.name || "Avatar"}
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="h-10 w-10 text-stone-400" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-16 px-6 pb-6 space-y-3">
              <div>
                <h2 className="text-2xl font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                  {formData.name || "YOUR NAME"}
                </h2>
                <p className="text-lg font-bold text-amber-700 font-[family-name:var(--font-space-mono)]">
                  {formData.title || "YOUR TITLE"}
                </p>
                <p className="text-sm font-medium text-stone-600 font-[family-name:var(--font-space)] mt-1">
                  {formData.subtitle}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-stone-700">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-bold font-[family-name:var(--font-space-mono)]">
                  {formData.location || "Location not set"}
                </span>
              </div>
              
              <div className="pt-4 border-t-2 border-stone-300">
                <p className="text-base font-medium text-stone-800 whitespace-pre-wrap font-[family-name:var(--font-space)] leading-relaxed">
                  {formData.bio || "No bio available."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ════════════════════ EDIT MODE ════════════════════ */
          <Tabs defaultValue="basic" className="space-y-6">
            
            {/* Custom styled Retro Tabs */}
            <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent p-0 w-full justify-start">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-amber-400 data-[state=active]:text-stone-900 data-[state=active]:border-stone-900 
                           data-[state=inactive]:bg-stone-200 data-[state=inactive]:text-stone-600 data-[state=inactive]:border-stone-400
                           border-2 rounded px-4 py-2 text-sm font-black font-[family-name:var(--font-space-mono)] transition-all"
                style={{ boxShadow: nesRaised }}
              >
                <User className="h-4 w-4 mr-2" /> Basic
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="data-[state=active]:bg-fuchsia-400 data-[state=active]:text-stone-900 data-[state=active]:border-stone-900 
                           data-[state=inactive]:bg-stone-200 data-[state=inactive]:text-stone-600 data-[state=inactive]:border-stone-400
                           border-2 rounded px-4 py-2 text-sm font-black font-[family-name:var(--font-space-mono)] transition-all"
                style={{ boxShadow: nesRaised }}
              >
                <LinkIcon className="h-4 w-4 mr-2" /> Images
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="data-[state=active]:bg-cyan-400 data-[state=active]:text-stone-900 data-[state=active]:border-stone-900 
                           data-[state=inactive]:bg-stone-200 data-[state=inactive]:text-stone-600 data-[state=inactive]:border-stone-400
                           border-2 rounded px-4 py-2 text-sm font-black font-[family-name:var(--font-space-mono)] transition-all"
                style={{ boxShadow: nesRaised }}
              >
                <Globe className="h-4 w-4 mr-2" /> Social
              </TabsTrigger>
              <TabsTrigger
                value="seo"
                className="data-[state=active]:bg-lime-400 data-[state=active]:text-stone-900 data-[state=active]:border-stone-900 
                           data-[state=inactive]:bg-stone-200 data-[state=inactive]:text-stone-600 data-[state=inactive]:border-stone-400
                           border-2 rounded px-4 py-2 text-sm font-black font-[family-name:var(--font-space-mono)] transition-all"
                style={{ boxShadow: nesRaised }}
              >
                <Search className="h-4 w-4 mr-2" /> SEO
              </TabsTrigger>
            </TabsList>

            {/* ── Basic Info Tab ── */}
            <TabsContent value="basic" className="mt-0 outline-none">
              <div className="border-2 border-stone-900 rounded bg-stone-100" style={{ boxShadow: nesRaised }}>
                <div className="bg-amber-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
                  <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                    📝 Basic Information
                  </h2>
                  <p className="text-xs font-bold text-stone-800 font-[family-name:var(--font-space)] mt-0.5">
                    Your name, title and bio
                  </p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel htmlFor="name">Name *</FieldLabel>
                      <input
                        id="name"
                        className={nesInputCls}
                        style={{ boxShadow: nesPressed }}
                        value={formData.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="title">Title *</FieldLabel>
                      <input
                        id="title"
                        className={nesInputCls}
                        style={{ boxShadow: nesPressed }}
                        value={formData.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="e.g.: Web Developer"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="subtitle">Subtitle</FieldLabel>
                    <input
                      id="subtitle"
                      className={nesInputCls}
                      style={{ boxShadow: nesPressed }}
                      value={formData.subtitle || ""}
                      onChange={(e) => handleChange("subtitle", e.target.value)}
                      placeholder="e.g.: KUET | Student ID: 2417012"
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <textarea
                      id="bio"
                      className={nesInputCls}
                      style={{ boxShadow: nesPressed }}
                      value={formData.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Write something about yourself..."
                      rows={5}
                    />
                  </div>

                  <div className="h-0.5 w-full bg-stone-900 my-4 opacity-20"></div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel htmlFor="location">Location</FieldLabel>
                      <input
                        id="location"
                        className={nesInputCls}
                        style={{ boxShadow: nesPressed }}
                        value={formData.location || ""}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="e.g.: Dhaka, Bangladesh"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <input
                        id="email"
                        type="email"
                        className={nesInputCls}
                        style={{ boxShadow: nesPressed }}
                        value={formData.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <input
                      id="phone"
                      className={nesInputCls}
                      style={{ boxShadow: nesPressed }}
                      value={formData.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+880 1XXX XXXXXX"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── Images Tab ── */}
            <TabsContent value="images" className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-stone-900 rounded bg-stone-100" style={{ boxShadow: nesRaised }}>
                  <div className="bg-fuchsia-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
                    <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                      📸 Profile Picture
                    </h2>
                  </div>
                  <div className="p-4">
                    <ImageUploader
                      value={formData.avatar_url || ""}
                      onChange={(url) => handleChange("avatar_url", url)}
                      preset="avatar"
                      folder="profile"
                    />
                  </div>
                </div>

                <div className="border-2 border-stone-900 rounded bg-stone-100" style={{ boxShadow: nesRaised }}>
                  <div className="bg-fuchsia-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
                    <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                      🖼️ Cover Image
                    </h2>
                  </div>
                  <div className="p-4">
                    <ImageUploader
                      value={formData.cover_url || ""}
                      onChange={(url) => handleChange("cover_url", url)}
                      preset="cover"
                      folder="profile"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── Social Links Tab ── */}
            <TabsContent value="social" className="mt-0 outline-none">
              <div className="border-2 border-stone-900 rounded bg-stone-100" style={{ boxShadow: nesRaised }}>
                <div className="bg-cyan-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
                  <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                    🔗 Social Media Links
                  </h2>
                  <p className="text-xs font-bold text-stone-800 font-[family-name:var(--font-space)] mt-0.5">
                    Your social profile links
                  </p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel htmlFor="github">GitHub</FieldLabel>
                      <input
                        id="github"
                        className={nesInputCls}
                        style={{ boxShadow: nesPressed }}
                        value={formData.github_url || ""}
                        onChange={(e) => handleChange("github_url", e.target.value)}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="linkedin">LinkedIn</FieldLabel>
                      <input
                        id="linkedin"
                        className={nesInputCls}
                        style={{ boxShadow: nesPressed }}
                        value={formData.linkedin_url || ""}
                        onChange={(e) => handleChange("linkedin_url", e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel htmlFor="facebook">Facebook</FieldLabel>
                      <input
                        id="facebook"
                        className={nesInputCls}
                        style={{ boxShadow: nesPressed }}
                        value={formData.facebook_url || ""}
                        onChange={(e) => handleChange("facebook_url", e.target.value)}
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="twitter">Twitter / X</FieldLabel>
                      <input
                        id="twitter"
                        className={nesInputCls}
                        style={{ boxShadow: nesPressed }}
                        value={formData.twitter_url || ""}
                        onChange={(e) => handleChange("twitter_url", e.target.value)}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
                    <input
                      id="whatsapp"
                      className={nesInputCls}
                      style={{ boxShadow: nesPressed }}
                      value={formData.whatsapp_url || ""}
                      onChange={(e) => handleChange("whatsapp_url", e.target.value)}
                      placeholder="https://wa.link/xxxxx"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── SEO Tab ── */}
            <TabsContent value="seo" className="mt-0 outline-none">
              <div className="border-2 border-stone-900 rounded bg-stone-100" style={{ boxShadow: nesRaised }}>
                <div className="bg-lime-400 px-4 py-3 border-b-2 border-stone-900 rounded-t">
                  <h2 className="text-base font-black text-stone-900 font-[family-name:var(--font-space-mono)]">
                    🔍 SEO Settings
                  </h2>
                  <p className="text-xs font-bold text-stone-800 font-[family-name:var(--font-space)] mt-0.5">
                    Search engine optimization
                  </p>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <FieldLabel htmlFor="meta_title">Meta Title</FieldLabel>
                    <input
                      id="meta_title"
                      className={nesInputCls}
                      style={{ boxShadow: nesPressed }}
                      value={formData.meta_title || ""}
                      onChange={(e) => handleChange("meta_title", e.target.value)}
                      placeholder="Page title (up to 60 characters)"
                      maxLength={60}
                    />
                    <p className="text-xs font-bold text-stone-500 mt-1.5 font-[family-name:var(--font-space-mono)]">
                      {(formData.meta_title || "").length}/60 characters
                    </p>
                  </div>

                  <div>
                    <FieldLabel htmlFor="meta_description">Meta Description</FieldLabel>
                    <textarea
                      id="meta_description"
                      className={nesInputCls}
                      style={{ boxShadow: nesPressed }}
                      value={formData.meta_description || ""}
                      onChange={(e) => handleChange("meta_description", e.target.value)}
                      placeholder="Brief description (up to 160 characters)"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-xs font-bold text-stone-500 mt-1.5 font-[family-name:var(--font-space-mono)]">
                      {(formData.meta_description || "").length}/160 characters
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        )}
      </div>
    </div>
  );
}