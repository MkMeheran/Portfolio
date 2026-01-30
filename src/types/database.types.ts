// Database Types - Matches Supabase schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================
// TABLE TYPES
// ============================================

export interface Profile {
  id: string;
  name: string;
  title: string;
  subtitle: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  whatsapp_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  degree: string;
  field_of_study: string | null;
  institution: string;
  institution_short: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
  description: string | null;
  logo_url: string | null;
  logo_alt: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  company_url: string | null;
  location: string | null;
  employment_type: string | null;
  description: string | null;
  skills_used: string[] | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  logo_url: string | null;
  logo_alt: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string | null;
  short_description: string | null;
  description: string | null;
  category: string | null;
  technologies: string[] | null;
  live_url: string | null;
  github_url: string | null;
  thumbnail_url: string | null;
  thumbnail_alt: string | null;
  gallery_images: string[] | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order_index: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  description: string | null;
  sub_skills: string[] | null;
  bg_color: string | null;
  has_certificates: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  certificates?: Certificate[];
}

export interface Certificate {
  id: string;
  skill_id: string;
  title: string;
  issuer: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  image_alt: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface IconLibrary {
  id: string;
  name: string;
  icon_name: string;
  icon_library: "si" | "fa" | "bi" | "lucide";
  category: string | null;
  preview_class: string | null;
  order_index: number;
  created_at: string;
}

export interface Tool {
  id: string;
  name: string;
  icon: string | null;  // Lucide icon name
  icon_url: string | null;
  icon_alt: string | null;
  category: string | null;
  description: string | null;
  url: string | null;
  proficiency: string | null;
  grid_size: string | null;
  bg_color: string | null;  // Background color
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Interest {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  description: string | null;
  order_index: number;
  created_at: string;
}

export interface Gallery {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  image_alt: string | null;
  category: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HeroCarousel {
  id: string;
  text: string;  // Main text content
  emoji: string | null;  // Emoji/icon
  line_number: number;  // Which line (1 or 2)
  order_index: number;  // Display order within the line
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  type: "string" | "number" | "boolean" | "json";
  description: string | null;
  updated_at: string;
}

// ============================================
// DATABASE INTERFACE (Supabase)
// ============================================

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      education: {
        Row: Education;
        Insert: Omit<Education, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Education, "id" | "created_at">>;
      };
      experience: {
        Row: Experience;
        Insert: Omit<Experience, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Experience, "id" | "created_at">>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at" | "views" | "likes"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          views?: number;
          likes?: number;
        };
        Update: Partial<Omit<Project, "id" | "created_at">>;
      };
      skill_categories: {
        Row: SkillCategory;
        Insert: Omit<SkillCategory, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<SkillCategory, "id" | "created_at">>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, "id" | "created_at" | "updated_at" | "category"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Skill, "id" | "created_at" | "category">>;
      };
      tools: {
        Row: Tool;
        Insert: Omit<Tool, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Tool, "id" | "created_at">>;
      };
      interests: {
        Row: Interest;
        Insert: Omit<Interest, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Interest, "id" | "created_at">>;
      };
      gallery: {
        Row: Gallery;
        Insert: Omit<Gallery, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Gallery, "id" | "created_at">>;
      };
      hero_carousel: {
        Row: HeroCarousel;
        Insert: Omit<HeroCarousel, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<HeroCarousel, "id" | "created_at">>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SiteSetting, "id">>;
      };
    };
  };
}

// ============================================
// LEGACY TYPES (for mock-data compatibility)
// ============================================

export interface Writing {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  type: "academic" | "tech" | "literature";
  tags: string[];
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LearningStat {
  id: string;
  metric_name: string;
  metric_type: string;
  current_value: number;
  target_value: number;
  description: string | null;
  icon: string | null;
  last_updated: string;
  created_at: string;
  // Aliases for mock data
  name?: string;
  type?: string;
  current?: number;
  target?: number;
  label?: string;
  streak?: number;
}
