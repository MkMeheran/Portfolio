"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader, ImageUploader } from "@/components/admin";
import { IconPicker } from "@/components/ui/icon-picker-optimized";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "web" as "gis" | "web" | "ai",
    tech_stack: [] as string[],
    demo_link: "",
    repo_link: "",
    image_url: "",
    featured: false,
    published: false,
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const addTech = () => {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tech),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        toast.error('Title and short description are required');
        setIsLoading(false);
        return;
      }

      // Ensure slug exists
      const slug = formData.slug && formData.slug.trim()
        ? formData.slug.trim()
        : generateSlug(formData.title || String(Date.now()));

      // Map UI form fields to DB column names
      const payload: any = {
        title: formData.title,
        slug,
        short_description: formData.description,
        description: formData.content || null,
        category: formData.category || 'web',
        technologies: formData.tech_stack || [],
        live_url: formData.demo_link || null,
        github_url: formData.repo_link || null,
        thumbnail_url: formData.image_url || null,
        is_featured: !!formData.featured,
        is_active: !!formData.published,
      };

      console.log('Creating project with payload:', payload);

      const { error } = await supabase.from("projects").insert([payload]);

      if (error) throw error;

      toast.success("Project created successfully!");
      router.push("/admin/projects");
    } catch (error: any) {
      console.error('New project create error:', error);
      try { console.error('New project create error (json):', JSON.stringify(error)); } catch {}
      toast.error(error?.message || JSON.stringify(error) || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <AdminHeader
          title="New Project"
          description="Add a new project to your portfolio"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="My Awesome Project"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="my-awesome-project"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used in the URL: /projects/{formData.slug || "your-slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="A brief description of your project..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Full Content (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Write detailed project description, challenges, solutions..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add technology (e.g., Next.js)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTech} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech_stack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="gap-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Published</Label>
                    <p className="text-xs text-muted-foreground">
                      Make visible on public site
                    </p>
                  </div>
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, published: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Featured</Label>
                    <p className="text-xs text-muted-foreground">
                      Show on homepage
                    </p>
                  </div>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, featured: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.category}
                  onValueChange={(value: "gis" | "web" | "ai") =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gis">GIS & Mapping</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="ai">AI & Automation</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demo_link">Demo URL</Label>
                  <Input
                    id="demo_link"
                    type="url"
                    value={formData.demo_link}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        demo_link: e.target.value,
                      }))
                    }
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo_link">Repository URL</Label>
                  <Input
                    id="repo_link"
                    type="url"
                    value={formData.repo_link}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        repo_link: e.target.value,
                      }))
                    }
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Project Image */}
            <Card>
              <CardHeader>
                <CardTitle>প্রজেক্ট ছবি</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  value={formData.image_url}
                  onChange={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      image_url: url,
                    }))
                  }
                  configKey="projectThumbnail"
                  altText=""
                  folder="projects"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Project
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
