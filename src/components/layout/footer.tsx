"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Github, Linkedin, Mail, MapPin, Facebook, Heart, Phone, ArrowRight, Music, Sparkles, Code, Globe } from "lucide-react";
import { placeholderProfile } from "@/lib/placeholders";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/writings", label: "Writings" },
];

const socialLinks = [
  { href: placeholderProfile.social.github, icon: Github, label: "GitHub", color: "hover:bg-stone-700" },
  { href: placeholderProfile.social.linkedin, icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-600" },
  { href: placeholderProfile.social.facebook, icon: Facebook, label: "Facebook", color: "hover:bg-blue-500" },
];

export function Footer() {
  const [profile, setProfile] = useState<{ avatar_url?: string | null; location?: string | null; email?: string | null } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.from('profile').select('avatar_url, location, email').single();
        if (mounted && data) setProfile(data as any);
      } catch {}
    })();
    return () => { mounted = false };
  }, []);
  return (
    <footer className="relative overflow-hidden border-t-2 border-stone-900 bg-stone-900 text-stone-100">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)`,
        }} />
      </div>
      
      <div className="container relative mx-auto px-4 sm:px-6 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 rounded-[12%] overflow-hidden border-2 border-amber-500 shadow-[3px_3px_0px_0px_rgba(251,191,36,0.5)] transition-all group-hover:shadow-[2px_2px_0px_0px_rgba(251,191,36,0.5)] group-hover:translate-x-[1px] group-hover:translate-y-[1px]">
                <Image
                  src={profile?.avatar_url || placeholderProfile.avatar}
                  alt="Meheran"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-lg text-white block font-[family-name:var(--font-space)]">Meheran</span>
                <span className="text-xs text-amber-400 font-medium">URP @ KUET</span>
              </div>
            </Link>
            <p className="text-sm text-stone-400 max-w-xs leading-relaxed font-[family-name:var(--font-space)]">
              Urban Planner • GIS Analyst • Web Developer
            </p>
            {/* Social Icons - Neu-brutalism */}
            <div className="flex gap-2 pt-2">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                const key = social.label ?? `social-${idx}`;
                return (
                  <Link
                    key={key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-9 w-9 items-center justify-center bg-stone-800 border-2 border-stone-600 text-stone-400 hover:text-white ${social.color} shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all`}
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-amber-400 uppercase tracking-wider font-[family-name:var(--font-space)]">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group text-sm text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-2 font-[family-name:var(--font-space)]"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Skills Preview */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-amber-400 uppercase tracking-wider font-[family-name:var(--font-space)]">What I Do</h3>
            <div className="flex flex-wrap gap-1.5">
              {["GIS", "Web Dev", "UI/UX", "Python", "Data"].map((skill) => (
                <span key={skill} className="text-[10px] font-bold text-stone-300 bg-stone-800 border border-stone-700 px-2 py-1 font-[family-name:var(--font-space-mono)]">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-xs mt-2">
              <Globe className="h-3 w-3 text-amber-400" />
              <span>Open to Opportunities</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-amber-400 uppercase tracking-wider font-[family-name:var(--font-space)]">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-sm text-stone-400">{profile?.location || placeholderProfile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <Link href={`mailto:${profile?.email || placeholderProfile.email}`} className="text-sm text-stone-400 hover:text-amber-400 transition-colors truncate">
                  {profile?.email || placeholderProfile.email}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-stone-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500 font-[family-name:var(--font-space)]">
            © {new Date().getFullYear()} Meheran. Made with <Heart className="inline h-3 w-3 text-red-500 fill-red-500" />
          </p>
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <Code className="h-3 w-3" />
              Built with Next.js
            </span>
            <span className="text-stone-700">•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Designed by Me
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
