"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HeaderFooterAdmin() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ site_name: "", site_tagline: "", resume_url: "", footer_html: "" });

  useEffect(() => {
    let mounted = true;
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("key, value");
      if (!mounted) return;
      const map: Record<string, string> = {};
      data?.forEach((r: any) => { if (r.key) map[r.key] = r.value || ""; });
      setForm({
        site_name: map.site_name || "",
        site_tagline: map.site_tagline || "",
        resume_url: map.resume_url || "",
        footer_html: map.footer_html || "",
      });
      setIsLoading(false);
    }
    fetchSettings();
    return () => { mounted = false; };
  }, [supabase]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const entries = Object.entries(form).map(([key, value]) => ({ key, value }));
      // Upsert: delete existing keys then insert
      for (const e of entries) {
        await supabase.from("site_settings").upsert({ key: e.key, value: e.value, type: 'string' });
      }
      toast.success("Settings saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[300px]"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <AdminHeader title="Header & Footer" description="Edit basic header/footer site settings" actions={(
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving} size="sm" className="admin-btn admin-btn-primary">
            {isSaving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Saving...</>) : (<><Save className="mr-2 h-4 w-4"/>Save</>)}
          </Button>
        </div>
      )} />

      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Basic Site Settings</CardTitle>
          <CardDescription>Edit the visible site name, tagline, resume link, and footer HTML.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Site Name</Label>
              <Input value={form.site_name} onChange={(e) => setForm(p => ({ ...p, site_name: e.target.value }))} />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input value={form.site_tagline} onChange={(e) => setForm(p => ({ ...p, site_tagline: e.target.value }))} />
            </div>
            <div>
              <Label>Resume URL</Label>
              <Input value={form.resume_url} onChange={(e) => setForm(p => ({ ...p, resume_url: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Footer HTML</Label>
              <Textarea value={form.footer_html} onChange={(e) => setForm(p => ({ ...p, footer_html: e.target.value }))} className="min-h-[120px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
