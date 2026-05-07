"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Home,
  Wrench,
  GraduationCap,
  Briefcase,
  User,
  Sparkles,
  Image,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: User,
  },
  {
    title: "About",
    href: "/admin/about",
    icon: FileText,
  },
  {
    title: "Education",
    href: "/admin/education",
    icon: GraduationCap,
  },
  {
    title: "Experience",
    href: "/admin/experience",
    icon: Briefcase,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Skills",
    href: "/admin/skills",
    icon: Wrench,
  },
  {
    title: "Tools",
    href: "/admin/tools",
    icon: Settings,
  },
  {
    title: "Hero Slider",
    href: "/admin/hero",
    icon: Sparkles,
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: Image,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
      return;
    }
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
          <span className="font-semibold">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.title}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Footer Actions */}
        <div className="p-4 space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              View Site
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </aside>
  );
}

export function AdminHeader({ 
  title, 
  description,
  actions 
}: { 
  title: string; 
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-3 sm:mb-8 px-1 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-stone-900">{title}</h1>
          {description && (
            <p className="text-stone-600 mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
