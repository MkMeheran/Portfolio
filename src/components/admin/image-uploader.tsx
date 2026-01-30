"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Link as LinkIcon, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Image presets for different use cases
const IMAGE_PRESETS = {
  avatar: { width: 400, height: 400, ratio: "1:1", label: "প্রোফাইল ছবি" },
  cover: { width: 1920, height: 480, ratio: "4:1", label: "কভার ইমেজ" },
  project: { width: 1200, height: 630, ratio: "1.91:1", label: "প্রজেক্ট থাম্বনেইল" },
  certificate: { width: 1200, height: 850, ratio: "1.41:1", label: "সার্টিফিকেট" },
  gallery: { width: 800, height: 600, ratio: "4:3", label: "গ্যালারি ছবি" },
  logo: { width: 200, height: 200, ratio: "1:1", label: "লোগো" },
  general: { width: 800, height: 600, ratio: "4:3", label: "সাধারণ ছবি" },
} as const;

type ImagePreset = keyof typeof IMAGE_PRESETS;

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  alt?: string;  // Changed from altText
  preset?: ImagePreset;
  folder?: string;
  showAltField?: boolean;
  showSizeInfo?: boolean;
  className?: string;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  onAltChange,
  alt = "",  // Changed from altText
  preset = "general",
  folder = "uploads",
  showAltField = true,
  showSizeInfo = true,
  className,
  label,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [useUrl, setUseUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");
  const [localAlt, setLocalAlt] = useState(alt);  // Changed from altText
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const presetInfo = IMAGE_PRESETS[preset];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("শুধুমাত্র ছবি ফাইল আপলোড করুন");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ফাইলের আকার ৫MB এর কম হতে হবে");
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "gallery";

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw uploadError;
      }

      // Try to get public URL
      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (urlError) {
        console.warn('getPublicUrl returned error:', urlError);
      }

      // Prefer returned publicUrl, otherwise construct fallback
      const publicUrl = urlData?.publicUrl ||
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(filePath)}`;

      onChange(publicUrl);
      toast.success("ছবি আপলোড হয়েছে!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("ছবি আপলোড করতে সমস্যা হয়েছে");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      toast.success("ছবির URL সেট হয়েছে!");
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAltChange = (newAlt: string) => {
    setLocalAlt(newAlt);
    onAltChange?.(newAlt);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label */}
      {label && (
        <Label className="text-sm font-bold">{label}</Label>
      )}

      {/* Size Info */}
      {showSizeInfo && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded border">
          <Info className="h-4 w-4 shrink-0" />
          <span>
            <strong>{presetInfo.label}</strong> — প্রস্তাবিত সাইজ: {presetInfo.width}×{presetInfo.height}px (Ratio: {presetInfo.ratio})
          </span>
        </div>
      )}

      {/* Toggle between upload and URL */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={!useUrl ? "default" : "outline"}
          size="sm"
          onClick={() => setUseUrl(false)}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-1.5" />
          আপলোড
        </Button>
        <Button
          type="button"
          variant={useUrl ? "default" : "outline"}
          size="sm"
          onClick={() => setUseUrl(true)}
          className="flex-1"
        >
          <LinkIcon className="h-4 w-4 mr-1.5" />
          URL দিন
        </Button>
      </div>

      {/* Upload or URL input */}
      {!useUrl ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-upload-${preset}`}
          />
          <Label
            htmlFor={`image-upload-${preset}`}
            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors bg-muted/30"
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>আপলোড হচ্ছে...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">ছবি আপলোড করতে ক্লিক করুন</span>
                <span className="text-xs">PNG, JPG, WEBP (সর্বোচ্চ ৫MB)</span>
              </div>
            )}
          </Label>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={handleUrlSubmit}>
            সেট করুন
          </Button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">প্রিভিউ:</Label>
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-muted/30">
              <Image
                src={value}
                alt={localAlt || "Preview"}
                fill
                className="object-contain"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Alt Text Field */}
      {showAltField && (
        <div className="space-y-1">
          <Label htmlFor={`alt-${preset}`} className="text-xs">
            Alt Text (SEO এর জন্য গুরুত্বপূর্ণ)
          </Label>
          <Input
            id={`alt-${preset}`}
            type="text"
            placeholder="ছবির বিবরণ লিখুন..."
            value={localAlt}
            onChange={(e) => handleAltChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
