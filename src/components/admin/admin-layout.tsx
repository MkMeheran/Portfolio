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
  Home,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ─── NES box-shadow tokens ───────────────────────────────────────────────────
const nesShadowRaised = "inset -3px -3px 0px #808080, inset 3px 3px 0px #dfdfdf";
const nesShadowPressed = "inset 2px 2px 0px #808080, inset -1px -1px 0px #dfdfdf";

// ─── Sidebar link colours (one per route, loops if needed) ───────────────────
const linkColors: { bg: string; header: string; icon: string }[] = [
  { bg: "bg-amber-100",   header: "bg-amber-300",   icon: "text-amber-700"   },
  { bg: "bg-fuchsia-100", header: "bg-fuchsia-300", icon: "text-fuchsia-700" },
  { bg: "bg-lime-100",    header: "bg-lime-300",     icon: "text-lime-700"    },
  { bg: "bg-cyan-100",    header: "bg-cyan-300",     icon: "text-cyan-700"    },
  { bg: "bg-rose-100",    header: "bg-rose-300",     icon: "text-rose-700"    },
  { bg: "bg-violet-100",  header: "bg-violet-300",   icon: "text-violet-700"  },
  { bg: "bg-orange-100",  header: "bg-orange-300",   icon: "text-orange-700"  },
  { bg: "bg-teal-100",    header: "bg-teal-300",     icon: "text-teal-700"    },
];

const sidebarLinks = [
  { title: "Dashboard",     href: "/admin",            icon: LayoutDashboard },
  { title: "Profile",       href: "/admin/profile",    icon: User            },
  { title: "Projects",      href: "/admin/projects",   icon: Briefcase       },
  { title: "Skills",        href: "/admin/skills",     icon: Wrench          },
  { title: "Education",     href: "/admin/education",  icon: GraduationCap   },
  { title: "Experience",    href: "/admin/experience", icon: Award           },
  { title: "Media Library", href: "/admin/media",      icon: ImageIcon       },
  { title: "Settings",      href: "/admin/settings",   icon: Settings        },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

// ─── Single sidebar link ──────────────────────────────────────────────────────
const SidebarLink = memo(
  ({
    link,
    pathname,
    index,
    onClick,
  }: {
    link: (typeof sidebarLinks)[0];
    pathname: string;
    index: number;
    onClick: () => void;
  }) => {
    const Icon = link.icon;
    const isActive =
      pathname === link.href ||
      (link.href !== "/admin" && pathname.startsWith(link.href));

    const color = linkColors[index % linkColors.length];

    return (
      <Link
        href={link.href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 text-sm font-black border-2 border-stone-900 transition-colors font-[family-name:var(--font-space-mono)]",
          isActive
            ? `${color.bg} text-stone-900`
            : "bg-white text-stone-700 hover:bg-stone-50"
        )}
        style={{ boxShadow: isActive ? nesShadowPressed : nesShadowRaised }}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? color.icon : "text-stone-500"
          )}
        />
        <span>{link.title}</span>
        {isActive && (
          <span
            className={cn(
              "ml-auto h-2 w-2 rounded-none border border-stone-900",
              color.header
            )}
          />
        )}
      </Link>
    );
  }
);
SidebarLink.displayName = "SidebarLink";

// ─── Main layout ──────────────────────────────────────────────────────────────
export const AdminLayout = memo(function AdminLayout({
  children,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── preserve original logic exactly ─────────────────────────────────────────
  const supabase = useMemo(() => createClient(), []);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [supabase, router]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
  // ─────────────────────────────────────────────────────────────────────────────

  // Current page label for header
  const currentPage =
    pathname === "/admin"
      ? "Dashboard"
      : (pathname.split("/").pop()?.replace(/-/g, " ") ?? "");

  return (
    <div className="admin-shell min-h-screen bg-stone-100 overflow-x-hidden">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ═══════════════════════════════ SIDEBAR ════════════════════════════════ */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[82vw] max-w-64 bg-stone-50 border-r-4 border-stone-900 transition-transform duration-200 flex flex-col",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ boxShadow: "4px 0 0 0 #c0c0c0" }}
      >
        {/* Logo strip */}
        <div
          className="flex items-center justify-between px-3 py-3 border-b-4 border-stone-900 bg-amber-400 shrink-0"
          style={{ boxShadow: "inset 0 -3px 0 #808080" }}
        >
          <Link href="/admin" className="flex items-center gap-2" onClick={closeSidebar}>
            <div
              className="w-9 h-9 bg-stone-900 border-2 border-stone-700 flex items-center justify-center"
              style={{ boxShadow: nesShadowRaised }}
            >
              <LayoutDashboard className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="font-black text-sm leading-none text-stone-900 font-[family-name:var(--font-space-mono)]">
                Admin Panel
              </p>
              <p className="text-[10px] text-stone-700 font-bold font-[family-name:var(--font-space-mono)]">
                Portfolio CMS
              </p>
            </div>
          </Link>

          {/* Close button (mobile) */}
          <button
            onClick={closeSidebar}
            className="lg:hidden flex items-center justify-center h-8 w-8 bg-white border-2 border-stone-900"
            style={{ boxShadow: nesShadowRaised }}
          >
            <X className="h-4 w-4 text-stone-900" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {sidebarLinks.map((link, i) => (
            <SidebarLink
              key={link.href}
              link={link}
              pathname={pathname}
              index={i}
              onClick={closeSidebar}
            />
          ))}
        </nav>

        {/* Footer actions */}
        <div
          className="shrink-0 p-2 border-t-4 border-stone-900 bg-stone-100 flex items-center gap-2"
          style={{ boxShadow: "inset 0 3px 0 #dfdfdf" }}
        >
          <Link
            href="/"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-lime-400 text-stone-900 text-xs font-black border-2 border-stone-900 font-[family-name:var(--font-space-mono)]"
            style={{ boxShadow: nesShadowRaised }}
          >
            <Home className="h-3.5 w-3.5" />
            View Site
            <ExternalLink className="h-3 w-3" />
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center justify-center h-9 w-9 bg-red-500 text-white border-2 border-stone-900"
            style={{ boxShadow: "inset -3px -3px 0px #7f0000, inset 3px 3px 0px #ff8080" }}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════ MAIN ═══════════════════════════════════ */}
      <div className="min-w-0 lg:ml-64">

        {/* Top header */}
        <header
          className="sticky top-0 z-30 h-14 bg-stone-900 border-b-4 border-stone-700 flex items-center justify-between px-2 sm:px-4"
          style={{ boxShadow: "0 4px 0 #404040" }}
        >
          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSidebar}
              className="lg:hidden flex items-center justify-center h-9 w-9 bg-amber-400 border-2 border-amber-200"
              style={{ boxShadow: nesShadowRaised }}
            >
              <Menu className="h-5 w-5 text-stone-900" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs font-black font-[family-name:var(--font-space-mono)]">
              <Link
                href="/admin"
                className="text-stone-400 hover:text-amber-400 transition-colors"
              >
                Admin
              </Link>
              {pathname !== "/admin" && (
                <>
                  <span className="text-stone-600">/</span>
                  <span className="text-amber-400 capitalize">{currentPage}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: user badge */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 bg-stone-800 border-2 border-stone-600"
              style={{ boxShadow: nesShadowPressed }}
            >
              <div className="w-6 h-6 bg-amber-400 border-2 border-amber-200 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-stone-900" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[11px] font-black text-white font-[family-name:var(--font-space-mono)] leading-none">
                  Admin
                </p>
                <p className="text-[9px] text-stone-400 font-[family-name:var(--font-space-mono)]">
                  admin@portfolio.com
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content — class names preserved exactly */}
        <main className="admin-main px-1 py-3 sm:px-4 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
});
AdminLayout.displayName = "AdminLayout";