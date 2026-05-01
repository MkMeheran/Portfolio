"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 bg-gradient-to-r from-amber-100 via-pink-100 to-blue-100",
      scrolled 
        ? "shadow-lg border-b-4 border-amber-400" 
        : "shadow-md border-b-2 border-amber-300"
    )}>
      <nav className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-lg border-2 border-stone-900 bg-white transition-all duration-200 group-hover:border-amber-500">
            <Image
              src="/favicon.ico"
              alt="Meheran logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base md:text-lg tracking-tight text-stone-900">Meheran</span>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-stone-700 block -mt-0.5 font-semibold">URP @ KUET</span>
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
                className="group flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md text-stone-800 hover:text-stone-900 hover:bg-white/80 border border-transparent hover:border-amber-300 transition-all duration-200"
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
                  "group flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 border",
                  isActive
                    ? "text-amber-950 bg-amber-300 border-amber-500 shadow-sm"
                    : "text-stone-800 border-transparent hover:text-stone-900 hover:bg-white/80 hover:border-amber-300"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-transform group-hover:scale-110",
                  isActive && "text-amber-800"
                )} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons - Desktop */}
        <div className="hidden lg:flex lg:items-center lg:gap-2">
          <Button variant="outline" size="sm" className="rounded-md border-2 border-stone-900 bg-white/80 text-stone-900 hover:bg-white" asChild>
            <a href="/cv.pdf" target="_blank">
              <FileText className="mr-1.5 h-4 w-4" />
              CV
            </a>
          </Button>
          <Button size="sm" className="rounded-md bg-gradient-to-r from-fuchsia-700 to-rose-800 hover:from-fuchsia-800 hover:to-rose-900 text-white font-bold shadow-md" asChild>
            <Link href="/#contact">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Hire Me
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation - Hamburger Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" className="rounded-md border-2 border-stone-900 bg-white/80 text-stone-900 hover:bg-white" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 pt-12 border-l-2 border-stone-900 bg-gradient-to-b from-amber-50 to-pink-50">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider px-3 mb-2">Navigation</p>
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
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white/80 hover:text-stone-900 transition-all duration-200 border border-transparent hover:border-amber-300"
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
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 border",
                      isActive
                        ? "bg-amber-300 text-amber-950 border-amber-500"
                        : "text-stone-700 border-transparent hover:bg-white/80 hover:text-stone-900 hover:border-amber-300"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive && "text-amber-800")} />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="mt-8 flex flex-col gap-2 px-3">
                <Button variant="outline" size="sm" className="w-full justify-start rounded-md border-2 border-stone-900 bg-white/80 text-stone-900 hover:bg-white" asChild>
                  <a href="/cv.pdf" target="_blank" onClick={() => setIsOpen(false)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Download CV
                  </a>
                </Button>
                <Button size="sm" className="w-full rounded-md bg-gradient-to-r from-fuchsia-700 to-rose-800 hover:from-fuchsia-800 hover:to-rose-900 text-white font-bold" asChild>
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
