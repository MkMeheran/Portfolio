import { createClient } from "@/lib/supabase/server";
import type { 
  Profile, 
  Education, 
  Experience, 
  Project, 
  Skill, 
  SkillCategory,
  Tool, 
  Interest, 
  Gallery, 
  HeroCarousel,
  SiteSetting 
} from "@/types/database.types";

// ============================================
// PROFILE
// ============================================
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .single();
  
  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return data;
}

// ============================================
// EDUCATION
// ============================================
export async function getEducation(): Promise<Education[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching education:", error);
    return [];
  }
  return data || [];
}

// ============================================
// EXPERIENCE
// ============================================
export async function getExperience(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
  return data || [];
}

// ============================================
// PROJECTS
// ============================================
export async function getProjects(options?: { 
  featured?: boolean; 
  published?: boolean;
  limit?: number;
  category?: string;
}): Promise<Project[]> {
  const supabase = await createClient();
  let query = supabase.from("projects").select("*");
  
  if (options?.featured) {
    query = query.eq("is_featured", true);
  }
  if (options?.published !== false) {
    query = query.eq("is_published", true);
  }
  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query.order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data || [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  
  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }
  return data;
}

// ============================================
// SKILLS
// ============================================
export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skill_categories")
    .select("*")
    .order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching skill categories:", error);
    return [];
  }
  return data || [];
}

export async function getSkills(options?: { 
  featured?: boolean;
  categoryId?: string;
}): Promise<Skill[]> {
  const supabase = await createClient();
  let query = supabase.from("skills").select(`
    *,
    category:skill_categories(*)
  `);
  
  if (options?.featured) {
    query = query.eq("is_featured", true);
  }
  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }
  
  const { data, error } = await query.order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
  return data || [];
}

// ============================================
// TOOLS
// ============================================
export async function getTools(options?: { 
  featured?: boolean;
  category?: string;
}): Promise<Tool[]> {
  const supabase = await createClient();
  let query = supabase.from("tools").select("*");
  
  if (options?.featured) {
    query = query.eq("is_featured", true);
  }
  if (options?.category) {
    query = query.eq("category", options.category);
  }
  
  const { data, error } = await query.order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
  return data || [];
}

// ============================================
// INTERESTS
// ============================================
export async function getInterests(): Promise<Interest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interests")
    .select("*")
    .order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching interests:", error);
    return [];
  }
  return data || [];
}

// ============================================
// GALLERY
// ============================================
export async function getGallery(category?: string): Promise<Gallery[]> {
  const supabase = await createClient();
  let query = supabase.from("gallery").select("*");
  
  if (category) {
    query = query.eq("category", category);
  }
  
  const { data, error } = await query.order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
  return data || [];
}

// ============================================
// HERO CAROUSEL
// ============================================
export async function getHeroCarousel(lineNumber?: number): Promise<HeroCarousel[]> {
  const supabase = await createClient();
  let query = supabase
    .from("hero_carousel")
    .select("*")
    .eq("is_active", true);
  
  if (lineNumber) {
    query = query.eq("line_number", lineNumber);
  }
  
  const { data, error } = await query.order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching hero carousel:", error);
    return [];
  }
  return data || [];
}

// ============================================
// SITE SETTINGS
// ============================================
export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  
  if (error) {
    console.error("Error fetching site settings:", error);
    return {};
  }
  
  const settings: Record<string, string> = {};
  data?.forEach((item) => {
    if (item.key && item.value) {
      settings[item.key] = item.value;
    }
  });
  return settings;
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();
  
  if (error) {
    return null;
  }
  return data?.value || null;
}

// ============================================
// COMBINED DATA (for homepage)
// ============================================
export async function getHomePageData() {
  const [profile, education, experiences, projects, heroCarousel] = await Promise.all([
    getProfile(),
    getEducation(),
    getExperience(),
    getProjects({ published: true }),
    getHeroCarousel(), // Get all carousel items
  ]);

  // Create default profile if none exists
  const defaultProfile: Profile = {
    id: "",
    name: "Portfolio",
    title: "Developer",
    subtitle: null,
    bio: null,
    location: null,
    email: null,
    phone: null,
    avatar_url: null,
    cover_url: null,
    github_url: null,
    linkedin_url: null,
    facebook_url: null,
    twitter_url: null,
    whatsapp_url: null,
    meta_title: null,
    meta_description: null,
    created_at: "",
    updated_at: "",
  };

  return {
    profile: profile || defaultProfile,
    education,
    experiences,
    projects,
    heroCarousel,
  };
}

export async function getAboutPageData() {
  const [profile, interests, gallery] = await Promise.all([
    getProfile(),
    getInterests(),
    getGallery(),
  ]);

  return { profile, interests, gallery };
}

export async function getSkillsPageData() {
  const [categories, skills, tools] = await Promise.all([
    getSkillCategories(),
    getSkills(),
    getTools({ featured: true }),
  ]);

  return { categories, skills, tools };
}
