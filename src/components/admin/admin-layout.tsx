"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  ExternalLink,
  Bell,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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
    title: "Projects",
    href: "/admin/projects",
    icon: Briefcase,
  },
  {
    title: "Skills",
    href: "/admin/skills",
    icon: Wrench,
  },
  {
    title: "Education",
    href: "/admin/education",
    icon: GraduationCap,
  },
  {
    title: "Experience",
    href: "/admin/experience",
    icon: Award,
  },
  {
    title: "Media Library",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Memoized sidebar link component
const SidebarLink = memo(({ link, pathname, onClick }: { 
  link: typeof sidebarLinks[0]; 
  pathname: string; 
  onClick: () => void;
}) => {
  const Icon = link.icon;
  const isActive = pathname === link.href || 
    (link.href !== "/admin" && pathname.startsWith(link.href));
  
  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-sm font-semibold transition-colors border-2 border-stone-900",
        isActive
          ? "bg-amber-200 text-stone-900"
          : "text-stone-700 bg-white hover:bg-amber-50"
      )}
    >
      <Icon className={cn("h-4 w-4", isActive && "text-amber-600")} />
      {link.title}
    </Link>
  );
});
SidebarLink.displayName = 'SidebarLink';

export const AdminLayout = memo(function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Memoize supabase client
  const supabase = useMemo(() => createClient(), []);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [supabase, router]);
  
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  return (
    <div className="admin-shell min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-amber-50 border-r-2 border-stone-900 transition-transform duration-300",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b-2 border-stone-900">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-amber-300 border-2 border-stone-900 flex items-center justify-center rounded-[4px]">
              <LayoutDashboard className="h-5 w-5 text-stone-900" />
            </div>
            <div>
              <span className="font-black text-sm">Admin Panel</span>
              <span className="text-[10px] text-muted-foreground block -mt-0.5">Portfolio CMS</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSidebar}
            className="lg:hidden h-8 w-8 admin-btn admin-btn-ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="h-[calc(100vh-64px-60px)] overflow-y-auto">
          <nav className="p-3 space-y-1">
            {sidebarLinks.map((link) => (
              <SidebarLink 
                key={link.href}
                link={link}
                pathname={pathname}
                onClick={closeSidebar}
              />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t-2 border-stone-900 bg-amber-50">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 admin-btn admin-btn-ghost text-xs"
            >
              <Home className="h-3.5 w-3.5" />
              View Site
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSignOut}
              className="h-9 w-9 admin-btn bg-white hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-amber-50 border-b-2 border-stone-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={openSidebar}
              className="lg:hidden h-9 w-9 admin-btn admin-btn-ghost"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Link href="/admin" className="text-muted-foreground hover:text-stone-900">
                Admin
              </Link>
              {pathname !== "/admin" && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="font-medium capitalize">
                    {pathname.split("/").pop()?.replace("-", " ")}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User */}
            <div className="flex items-center gap-2 pl-2 border-l-2 border-stone-900">
              <div className="w-8 h-8 rounded-[4px] bg-amber-100 border-2 border-stone-900 flex items-center justify-center overflow-hidden">
                <User className="h-4 w-4 text-amber-700" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold">Admin</p>
                <p className="text-[10px] text-muted-foreground">admin@portfolio.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
});
AdminLayout.displayName = 'AdminLayout';
