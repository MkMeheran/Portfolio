import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Wrench,
  Sparkles,
  Image,
  Settings,
  ExternalLink,
  Eye,
  ArrowRight,
} from "lucide-react";

// Quick action cards for admin
const quickActions = [
  {
    title: "Profile",
    description: "Name, title, bio, social links",
    href: "/admin/profile",
    icon: User,
    color: "bg-blue-500",
    statKey: "profile",
  },
  {
    title: "Education",
    description: "Degrees, institutions, GPA",
    href: "/admin/education",
    icon: GraduationCap,
    color: "bg-amber-500",
    statKey: "education",
  },
  {
    title: "Experience",
    description: "Jobs, internships, volunteer",
    href: "/admin/experience",
    icon: Briefcase,
    color: "bg-sky-500",
    statKey: "experience",
  },
  {
    title: "Projects",
    description: "Portfolio projects",
    href: "/admin/projects",
    icon: FolderKanban,
    color: "bg-violet-500",
    statKey: "projects",
  },
  {
    title: "Skills & Certificates",
    description: "Skills, tools, certificates",
    href: "/admin/skills",
    icon: Wrench,
    color: "bg-emerald-500",
    statKey: "skills",
  },
  {
    title: "Hero Carousel",
    description: "Homepage roles & tags",
    href: "/admin/hero",
    icon: Sparkles,
    color: "bg-pink-500",
    statKey: "carousel",
  },
  {
    title: "Gallery",
    description: "Images & media",
    href: "/admin/gallery",
    icon: Image,
    color: "bg-orange-500",
    statKey: "gallery",
  },
  {
    title: "Settings",
    description: "Site configuration",
    href: "/admin/settings",
    icon: Settings,
    color: "bg-stone-500",
    statKey: null,
  },
];

async function getStats() {
  const supabase = await createClient();
  
  try {
    const [
      { count: educationCount },
      { count: experienceCount },
      { count: projectCount },
      { count: skillCount },
      { count: carouselCount },
      { count: galleryCount },
    ] = await Promise.all([
      supabase.from("education").select("*", { count: "exact", head: true }),
      supabase.from("experience").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("skills").select("*", { count: "exact", head: true }),
      supabase.from("hero_carousel").select("*", { count: "exact", head: true }),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
    ]);

    return {
      profile: 1,
      education: educationCount || 0,
      experience: experienceCount || 0,
      projects: projectCount || 0,
      skills: skillCount || 0,
      carousel: carouselCount || 0,
      gallery: galleryCount || 0,
    };
  } catch {
    return {
      profile: 1,
      education: 0,
      experience: 0,
      projects: 0,
      skills: 0,
      carousel: 0,
      gallery: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <AdminHeader 
        title="Dashboard" 
        description="Manage your portfolio" 
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold">{stats.projects}</p>
              </div>
              <div className="p-3 bg-violet-100 rounded-lg">
                <FolderKanban className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Skills</p>
                <p className="text-3xl font-bold">{stats.skills}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Wrench className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Education</p>
                <p className="text-3xl font-bold">{stats.education}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="text-3xl font-bold">{stats.experience}</p>
              </div>
              <div className="p-3 bg-sky-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const count = action.statKey ? stats[action.statKey as keyof typeof stats] : null;
          
          return (
            <Link key={action.href} href={action.href}>
              <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {count !== null && count > 0 && (
                      <span className="text-xs font-bold bg-muted px-2 py-1 rounded-full">
                        {count}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-primary font-medium group-hover:underline">
                    Manage
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* View Site Button */}
      <div className="mt-8 flex justify-center">
        <Button asChild size="lg" className="gap-2">
          <Link href="/" target="_blank">
            <Eye className="h-5 w-5" />
            View Live Site
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
