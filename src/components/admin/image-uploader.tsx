"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, Link as LinkIcon, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── NES Shadow Tokens ────────────────────────────────────────────────────────
const nesRaised  = "inset -3px -3px 0px #6b6b6b, inset 3px 3px 0px #e0d8cc";
const nesPressed = "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc";
const nesDanger  = "inset -3px -3px 0px #7f0000, inset 3px 3px 0px #ff8080";

// ─── Reusable NES-style input wrapper ─────────────────────────────────────────
const nesInputCls =
  "w-full px-3 py-2 text-sm font-medium text-stone-900 bg-stone-50 " +
  "border-2 border-stone-900 rounded focus:outline-none focus:border-amber-600 " +
  "placeholder:text-stone-400 font-[family-name:var(--font-space)]";

// ─── Field Label ──────────────────────────────────────────────────────────────
function FieldLabel({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-black text-stone-800 mb-1 font-[family-name:var(--font-space-mono)]", className)}
    >
      {children}
    </label>
  );
}

// Image presets for different use cases
const IMAGE_PRESETS = {
  avatar: { width: 400, height: 400, ratio: "1:1", label: "Profile photo" },
  cover: { width: 1920, height: 480, ratio: "4:1", label: "Cover image" },
  project: { width: 1200, height: 630, ratio: "1.91:1", label: "Project thumbnail" },
  certificate: { width: 1200, height: 850, ratio: "1.41:1", label: "Certificate" },
  gallery: { width: 800, height: 600, ratio: "4:3", label: "Gallery image" },
  logo: { width: 200, height: 200, ratio: "1:1", label: "Logo" },
  general: { width: 800, height: 600, ratio: "4:3", label: "General image" },
} as const;

type ImagePreset = keyof typeof IMAGE_PRESETS;

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  alt?: string;
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
  alt = "",
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
  const [localAlt, setLocalAlt] = useState(alt);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const presetInfo = IMAGE_PRESETS[preset];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
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
      const { data: urlData } = await supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Prefer returned publicUrl, otherwise construct fallback
      const publicUrl = urlData?.publicUrl ||
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(filePath)}`;

      onChange(publicUrl);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      toast.success("Image URL set!");
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
    <div className={cn("space-y-4", className)}>
      {/* Label */}
      {label && <FieldLabel>{label}</FieldLabel>}

      {/* Size Info (Retro Info Box) */}
      {showSizeInfo && (
        <div 
          className="flex items-center gap-2 px-3 py-2 bg-amber-100 border-2 border-stone-900 rounded"
          style={{ boxShadow: nesRaised }}
        >
          <Info className="h-4 w-4 shrink-0 text-amber-700" />
          <span className="text-xs font-bold text-stone-800 font-[family-name:var(--font-space-mono)] leading-tight">
            <strong>{presetInfo.label}</strong> — Rec. size: {presetInfo.width}×{presetInfo.height}px (Ratio: {presetInfo.ratio})
          </span>
        </div>
      )}

      {/* Toggle between Upload and URL */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setUseUrl(false)}
          className={cn(
            "flex-1 flex items-center justify-center py-2 text-xs sm:text-sm font-black border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)] transition-all",
            !useUrl ? "bg-amber-400 text-stone-900" : "bg-stone-200 text-stone-600 hover:bg-stone-300"
          )}
          style={{ boxShadow: !useUrl ? nesPressed : nesRaised }}
        >
          <Upload className="h-4 w-4 mr-1.5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setUseUrl(true)}
          className={cn(
            "flex-1 flex items-center justify-center py-2 text-xs sm:text-sm font-black border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)] transition-all",
            useUrl ? "bg-cyan-400 text-stone-900" : "bg-stone-200 text-stone-600 hover:bg-stone-300"
          )}
          style={{ boxShadow: useUrl ? nesPressed : nesRaised }}
        >
          <LinkIcon className="h-4 w-4 mr-1.5" />
          Use URL
        </button>
      </div>

      {/* Upload or URL input area */}
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
          <label
            htmlFor={`image-upload-${preset}`}
            className="flex flex-col items-center justify-center w-full h-36 bg-stone-200 border-2 border-stone-900 rounded cursor-pointer hover:bg-stone-300 transition-colors"
            style={{ boxShadow: nesPressed }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-stone-600">
                <Loader2 className="h-6 w-6 animate-spin text-stone-800" />
                <span className="text-xs font-black font-[family-name:var(--font-space-mono)]">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-stone-600">
                <Upload className="h-8 w-8 text-stone-800" />
                <span className="text-sm font-black font-[family-name:var(--font-space-mono)] text-stone-800">
                  Click to select image
                </span>
                <span className="text-[10px] font-bold font-[family-name:var(--font-space)] uppercase tracking-wider">
                  PNG, JPG, WEBP (Max 5MB)
                </span>
              </div>
            )}
          </label>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className={nesInputCls}
            style={{ boxShadow: nesPressed }}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-lime-400 text-stone-900 text-sm font-black border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)] active:scale-95 transition-transform"
            style={{ boxShadow: nesRaised }}
          >
            Set
          </button>
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="space-y-2 mt-4 p-3 bg-stone-100 border-2 border-stone-900 rounded" style={{ boxShadow: nesRaised }}>
          <FieldLabel className="text-xs font-black text-stone-600 font-[family-name:var(--font-space-mono)]">Preview:</FieldLabel>
          <div className="relative">
            <div 
              className="relative w-full h-48 bg-stone-200 border-2 border-stone-900 rounded overflow-hidden"
              style={{ boxShadow: nesPressed }}
            >
              <Image
                src={value}
                alt={localAlt || "Preview"}
                fill
                className="object-contain"
              />
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 bg-red-500 border-2 border-stone-900 rounded active:scale-95 transition-transform"
              style={{ boxShadow: nesDanger }}
              onClick={handleRemove}
              title="Remove image"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Alt Text Field */}
      {showAltField && (
        <div className="space-y-1">
          <FieldLabel htmlFor={`alt-${preset}`}>
            Alt text <span className="text-xs text-stone-500 font-[family-name:var(--font-space)]">(Important for SEO)</span>
          </FieldLabel>
          <input
            id={`alt-${preset}`}
            type="text"
            placeholder="Describe the image..."
            value={localAlt}
            onChange={(e) => handleAltChange(e.target.value)}
            className={nesInputCls}
            style={{ boxShadow: nesPressed }}
          />
        </div>
      )}
    </div>
  );
}