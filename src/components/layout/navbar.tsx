"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Menu, 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap,
  Wrench,
  Award,
  Home,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { placeholderProfile } from "@/lib/placeholders";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "https://udyomxorg.vercel.app/projects", label: "Projects", icon: Briefcase, external: true },
  { href: "/skills", label: "Skills", icon: Wrench },
  { href: "/#education", label: "Education", icon: GraduationCap },
  { href: "/#experience", label: "Experience", icon: Award },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState<{ avatar_url?: string | null } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch profile (client-side) and prefer avatar_url
  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.from("profile").select("avatar_url").single();
        if (mounted && data) setProfile(data as any);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" 
        : "bg-background/80 backdrop-blur-sm"
    )}>
      <nav className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-lg border border-border transition-all duration-200 group-hover:border-amber-400 group-hover:shadow-md">
            <Image
              src={profile?.avatar_url || placeholderProfile.avatar}
              alt="Meheran"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-base sm:text-lg tracking-tight">Meheran</span>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground block -mt-0.5 font-medium">URP @ KUET</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]) && link.href.split("#")[0] !== "");
            
            return link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>{link.label}</span>
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "text-foreground bg-amber-100 dark:bg-amber-900/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-transform group-hover:scale-110",
                  isActive && "text-amber-600"
                )} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons - Desktop */}
        <div className="hidden lg:flex lg:items-center lg:gap-2">
          <Button variant="outline" size="sm" className="rounded-md" asChild>
            <a href="/cv.pdf" target="_blank">
              <FileText className="mr-1.5 h-4 w-4" />
              CV
            </a>
          </Button>
          <Button size="sm" className="rounded-md bg-amber-500 hover:bg-amber-600 text-white" asChild>
            <Link href="/#contact">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Hire Me
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" className="rounded-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 pt-12 border-l">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Navigation</p>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    <ExternalLink className="h-3 w-3 opacity-50 ml-auto" />
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-amber-100 dark:bg-amber-900/30 text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive && "text-amber-600")} />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="mt-8 flex flex-col gap-2 px-3">
                <Button variant="outline" size="sm" className="w-full justify-start rounded-md" asChild>
                  <a href="/cv.pdf" target="_blank" onClick={() => setIsOpen(false)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Download CV
                  </a>
                </Button>
                <Button size="sm" className="w-full rounded-md bg-amber-500 hover:bg-amber-600 text-white" asChild>
                  <Link href="/#contact" onClick={() => setIsOpen(false)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Contact Me
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
