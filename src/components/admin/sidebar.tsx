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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const sidebarLinks = [
  {
    title: "ড্যাশবোর্ড",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "প্রোফাইল",
    href: "/admin/profile",
    icon: User,
  },
  {
    title: "শিক্ষা",
    href: "/admin/education",
    icon: GraduationCap,
  },
  {
    title: "অভিজ্ঞতা",
    href: "/admin/experience",
    icon: Briefcase,
  },
  {
    title: "প্রজেক্টস",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "দক্ষতা",
    href: "/admin/skills",
    icon: Wrench,
  },
  {
    title: "টুলস",
    href: "/admin/tools",
    icon: Settings,
  },
  {
    title: "হিরো স্লাইডার",
    href: "/admin/hero",
    icon: Sparkles,
  },
  {
    title: "গ্যালারি",
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
              সাইট দেখুন
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            লগ আউট
          </Button>
        </div>
      </div>
    </aside>
  );
}

export function AdminHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
