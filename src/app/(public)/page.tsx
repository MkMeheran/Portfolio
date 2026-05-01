import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ArrowRight,
  MapPin,
  Calendar,
  GraduationCap,
  Download,
  Code,
  Brain,
  Briefcase,
  Trophy,
  Facebook,
  Award,
  Target,
  CheckCircle2,
  FileText,
  Eye,
  X,
  ChevronRight,
} from "lucide-react";
import { getHomePageData } from "@/lib/data";
import { InfiniteCarousel } from "@/components/ui/infinite-carousel";
import { SkillsSection } from "@/components/sections/skills-section";
import type { Profile, Education, Experience, Project, HeroCarousel } from "@/types/database.types";

function normalizeImageUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  try {
    return new URL(trimmed).toString();
  } catch {
    return null;
  }
}

// Hero Section - Facebook/LinkedIn style with proper sizing
function HeroSection({ profile, heroCarousel }: { profile: Profile; heroCarousel: HeroCarousel[] }) {
  const githubUrl = profile.github_url?.trim() || "https://github.com/MkMeheran";
  const linkedinUrl = profile.linkedin_url?.trim() || "https://www.linkedin.com/";
  const facebookUrl = profile.facebook_url?.trim() || "https://facebook.com/Meheran216/";
  const coverUrl = normalizeImageUrl(profile.cover_url);
  const avatarUrl = normalizeImageUrl(profile.avatar_url) || "/placeholder-avatar.jpg";

  // Group carousel items by line_number
  const carouselLine1 = heroCarousel
    .filter(item => item.line_number === 1)
    .sort((a, b) => a.order_index - b.order_index)
    .map(item => ({ id: item.id, text: item.text, icon: item.emoji || "" }));
  
  const carouselLine2 = heroCarousel
    .filter(item => item.line_number === 2)
    .sort((a, b) => a.order_index - b.order_index)
    .map(item => ({ id: item.id, text: item.text, icon: item.emoji || "" }));

  return (
    <section className="relative">
      {/* Cover Image - responsive ratio: 16:9 mobile, cropped on desktop */}
      <div className="relative h-auto sm:h-80 md:h-96 lg:h-96 bg-linear-to-br from-amber-200 via-amber-100 to-orange-100 border-b-2 border-foreground/10 overflow-hidden">
        <div className="relative w-full aspect-video sm:aspect-auto sm:h-full">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt="Cover"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-8 left-8 w-28 h-28 border-4 border-amber-400/40 rotate-12" />
              <div className="absolute top-12 right-12 w-24 h-24 border-4 border-orange-400/40 rounded-full" />
              <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-amber-400/25 -rotate-6" />
              <div className="absolute top-20 right-1/3 w-16 h-16 bg-orange-400/30 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Profile Content - Mobile: centered below cover. Tablet+: side-by-side */}
      {/* Breakpoints: mobile(<480), mobile-tablet(480-640), tablet(640-768), tablet-desktop(768-1024), desktop(>1024) */}
      <div className="container mx-auto px-4 min-[480px]:px-5 sm:px-6 lg:px-8">
        {/* Mobile: Centered layout, Tablet+: Side-by-side */}
        <div className="flex flex-col md:flex-row md:gap-6 lg:gap-10">
          {/* Profile Picture - Centered on mobile, left on tablet+ */}
          <div className="flex justify-center md:block shrink-0 -mt-16 sm:-mt-20 md:-mt-20 lg:-mt-24 relative z-10">
            <div className="relative h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64 border-4 border-background bg-card shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden rounded-lg">
              <Image
                src={avatarUrl}
                alt={profile.name}
                fill
                sizes="(max-width: 768px) 210px, (max-width: 1024px) 232px, 256px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* All Content - Centered on mobile, right of photo on tablet+ */}
          <div className="flex-1 min-w-0 text-center md:text-left md:pt-1">
            {/* Name */}
            <h1 className="text-2xl min-[480px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground font-[family-name:var(--font-space)] mt-2 mb-1.5">
              {profile.name}
            </h1>
            
            {/* Title and Location - increased sizes and spacing */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 min-[480px]:gap-2 sm:gap-2 flex-wrap text-sm min-[480px]:text-base sm:text-lg md:text-xl text-foreground/80 mb-3 min-[480px]:mb-4 sm:mb-4 md:mb-5 font-[family-name:var(--font-space)]">
              <span className="flex items-center gap-0.75 min-[480px]:gap-1">
                <GraduationCap className="h-4 w-4 min-[480px]:h-4.5 min-[480px]:w-4.5 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5 text-amber-600 shrink-0" />
                <span className="whitespace-nowrap">{profile.title}</span>
              </span>
              <span className="hidden sm:inline text-foreground/30">•</span>
              <span className="flex items-center gap-0.75 min-[480px]:gap-1">
                <MapPin className="h-4 w-4 min-[480px]:h-4.5 min-[480px]:w-4.5 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5 shrink-0" />
                {profile.location}
              </span>
            </div>

            {/* Bio - Shows from mobile-tablet (480px+), increased sizes */}
            <p className="hidden min-[480px]:block text-sm min-[480px]:text-base sm:text-lg md:text-xl text-foreground/70 max-w-3xl mb-3 min-[480px]:mb-4 sm:mb-5 md:mb-6 leading-relaxed font-[family-name:var(--font-space)]">
              Bridging urban planning with technology — spatial thinking meets modern development. Building digital solutions with AI, GIS, and Web Dev.
            </p>

            {/* Buttons + Social - Always in same row, shows from tablet-desktop (768px+) */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 justify-center md:justify-start">
              <Button size="sm" className="h-9 sm:h-10 text-sm sm:text-base px-3.5 sm:px-4 font-bold font-[family-name:var(--font-space)]" variant="cta" asChild>
                <Link href="https://udyomxorg.vercel.app/projects">
                  <Target className="mr-2 h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  Projects
                </Link>
              </Button>
              <Button size="sm" className="h-9 sm:h-10 text-sm sm:text-base px-3.5 sm:px-4 font-bold font-[family-name:var(--font-space)]" variant="outline" asChild>
                <Link href="https://drive.google.com/file/d/1GLkglhVgT6c86CDlimGgCC7nLUBPeGeo/view?usp=sharing" target="_blank">
                  <Download className="mr-2 h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  Resume
                </Link>
              </Button>
              <Button size="sm" className="h-9 sm:h-10 text-sm sm:text-base px-3.5 sm:px-4 font-bold font-[family-name:var(--font-space)]" variant="cta-green" asChild>
                <Link href={`mailto:${profile.email}`}>
                  <Mail className="mr-2 h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  Contact
                </Link>
              </Button>
              <div className="flex items-center gap-2 lg:gap-2.5 ml-1">
                <Link href={githubUrl} target="_blank" aria-label="GitHub" className="p-2 lg:p-2.5 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  <Github className="h-5 w-5 lg:h-5.5 lg:w-5.5" />
                </Link>
                <Link href={linkedinUrl} target="_blank" aria-label="LinkedIn" className="p-2 lg:p-2.5 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  <Linkedin className="h-5 w-5 lg:h-5.5 lg:w-5.5" />
                </Link>
                <Link href={facebookUrl} target="_blank" aria-label="Facebook" className="p-2 lg:p-2.5 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  <Facebook className="h-5 w-5 lg:h-5.5 lg:w-5.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Below photo: Buttons + Social for mobile to tablet (< 768px) */}
        <div className="md:hidden mt-4 min-[480px]:mt-5 sm:mt-6 w-full">
          {/* Bio - Only on pure mobile (< 480px) */}
          <p className="min-[480px]:hidden text-sm text-foreground/70 mb-4 leading-relaxed text-center">
            Bridging urban planning with technology — spatial thinking meets modern development. Building digital solutions with AI, GIS, and Web Dev.
          </p>
          
          {/* Bio for mobile-tablet (480px+) - paragraph style */}
          <p className="hidden min-[480px]:block md:hidden text-sm sm:text-base text-foreground/70 mb-5 sm:mb-6 leading-relaxed">
            Bridging urban planning with technology — spatial thinking meets modern development. Building digital solutions with AI, GIS, and Web Dev.
          </p>
          
          {/* Buttons + Social with wrapping for mobile */}
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-2.5">
            {/* Top row: Buttons wrap on mobile */}
            <div className="w-full flex flex-wrap items-center gap-2 sm:gap-2.5 sm:flex-nowrap">
              <Button size="sm" className="h-10 sm:h-11 text-base sm:text-lg px-4 sm:px-5 font-bold font-[family-name:var(--font-space)] flex-1 sm:flex-none min-w-max" variant="cta" asChild>
                <Link href="https://udyomxorg.vercel.app/projects" target="_blank">
                  <Target className="mr-2 h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  Projects
                </Link>
              </Button>
              <Button size="sm" className="h-10 sm:h-11 text-base sm:text-lg px-4 sm:px-5 font-bold font-[family-name:var(--font-space)] flex-1 sm:flex-none min-w-max" variant="outline" asChild>
                <Link href="https://drive.google.com/file/d/1GLkglhVgT6c86CDlimGgCC7nLUBPeGeo/view?usp=sharing" target="_blank">
                  <Download className="mr-2 h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  Resume
                </Link>
              </Button>
              <Button size="sm" className="h-10 sm:h-11 text-base sm:text-lg px-4 sm:px-5 font-bold font-[family-name:var(--font-space)] flex-1 sm:flex-none min-w-max" variant="cta-green" asChild>
                <Link href={`mailto:${profile.email}`}>
                  <Mail className="mr-2 h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  Contact
                </Link>
              </Button>
            </div>
            
            {/* Social icons row */}
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
               <Link href={githubUrl} target="_blank" aria-label="GitHub" className="p-2.5 sm:p-3 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                 <Github className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
               </Link>
               <Link href={linkedinUrl} target="_blank" aria-label="LinkedIn" className="p-2.5 sm:p-3 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                 <Linkedin className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
               </Link>
               <Link href={facebookUrl} target="_blank" aria-label="Facebook" className="p-2.5 sm:p-3 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                 <Facebook className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
               </Link>
            </div>
          </div>
        </div>

        {/* Infinite Carousel - Full width */}
        <div className="py-8 min-[480px]:py-10 sm:py-12 md:py-14">
          <h2 className="text-lg min-[480px]:text-xl sm:text-2xl font-black text-muted-foreground mb-4 min-[480px]:mb-5 font-[family-name:var(--font-space)]">Roles, Interests & Achievements</h2>
          {carouselLine1.length > 0 && <InfiniteCarousel items={carouselLine1} direction="left" speed="normal" />}
          <div className="h-4" />
          {carouselLine2.length > 0 && <InfiniteCarousel items={carouselLine2} direction="right" speed="slow" />}
        </div>
      </div>
    </section>
  );
}

// Category badges config
const categoryBadges: Record<string, { label: string; class: string }> = {
  gis: { label: "GIS", class: "bg-emerald-700 text-white" },
  web: { label: "Web", class: "bg-sky-700 text-white" },
  ai: { label: "AI", class: "bg-pink-700 text-white" },
  planning: { label: "Planning", class: "bg-amber-600 text-stone-950" },
};

// Featured Projects - Small cards, limited rows by screen size
function FeaturedProjects({ projects }: { projects: Project[] }) {
  const allFeaturedProjects = projects.filter((p) => p.is_featured);
  // Desktop/tablet: 2 rows max (10 projects for 5-col, 8 for 4-col, 6 for 3-col)
  // Mobile: 3 rows max (6 projects for 2-col)
  const featuredProjects = allFeaturedProjects.slice(0, 10);

  return (
    <section id="projects" className="px-1 md:px-2 py-10 sm:py-12 md:py-14 lg:py-16">
      <div className="container mx-auto px-2 min-[480px]:px- sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 min-[480px]:gap-4 mb-6 min-[480px]:mb-8">
          <div className="p-2.5 sm:p-3 bg-sky-500 border-2 border-stone-900 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]">
            <Briefcase className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2.5xl min-[480px]:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-space)]">Featured Projects</h2>
            <p className="text-sm min-[480px]:text-base sm:text-lg text-muted-foreground font-medium font-[family-name:var(--font-space)]">Showcasing my best work</p>
          </div>
        </div>

        {/* Grid with row limits: mobile 3 rows (6), tablet 2 rows (6-8), desktop 2 rows (10) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-2 sm:gap-2.5 md:gap-3">
          {featuredProjects.map((project, index) => {
            const thumbnailUrl = normalizeImageUrl(project.thumbnail_url);
            return (
              <Card 
                key={project.id} 
                className={`overflow-hidden group bg-card border-2 border-stone-900 rounded-lg p-0
                  ${index >= 6 ? 'hidden sm:block' : ''}
                  ${index >= 8 ? 'hidden md:block' : ''}
                `}
                style={{
                  border: '3px solid #000',
                  boxShadow: 'inset -3px -3px 0px #808080, inset 3px 3px 0px #dfdfdf'
                }}
              >
                {/* Image - Fixed 16:9 ratio */}
                <div className="relative w-full aspect-video bg-amber-50 border-b-2 border-stone-900 overflow-hidden">
                  {thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 280px, 220px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {project.category === "gis" && <MapPin className="h-9 w-9 sm:h-10 sm:w-10 text-emerald-500/30" />}
                      {project.category === "web" && <Code className="h-9 w-9 sm:h-10 sm:w-10 text-sky-500/30" />}
                      {project.category === "ai" && <Brain className="h-9 w-9 sm:h-10 sm:w-10 text-pink-500/30" />}
                      {project.category === "planning" && <Target className="h-9 w-9 sm:h-10 sm:w-10 text-amber-500/30" />}
                    </div>
                  )}
                  {/* Category badge */}
                  {project.category && (
                  <div className={`absolute top-1.5 left-1.5 text-[9px] sm:text-[10px] font-bold px-1.5 py-1 border border-stone-900 rounded ${categoryBadges[project.category]?.class || 'bg-stone-200'} font-[family-name:var(--font-space)]`}>
                    {categoryBadges[project.category]?.label || project.category}
                  </div>
                  )}
                  {/* Links on hover */}
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.live_url && (
                      <Link href={project.live_url} target="_blank" aria-label="View project" className="p-1 bg-white border border-stone-900 text-stone-700 hover:bg-stone-100 rounded">
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Link>
                    )}
                    {project.github_url && (
                      <Link href={project.github_url} target="_blank" aria-label="View source code" className="p-1 bg-white border border-stone-900 text-stone-700 hover:bg-stone-100 rounded">
                        <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Link>
                    )}
                  </div>
                </div>
                
                {/* Content - Title Only, vertically centered */}
                <div className="flex-1 flex items-center justify-center  py-2 sm:py-2.5">
                  <h3 className="font-bold text-base sm:text-lg md:text-lg lg:text-xl leading-snug group-hover:text-amber-700 transition-colors font-[family-name:var(--font-space)] text-center">
                    {project.title}
                  </h3>
                </div>
              </Card>
            );
          })}
        </div>

        {/* View All Button - Centered */}
        <div className="mt-6 min-[480px]:mt-8 flex justify-center">
          <Button size="sm" className="text-base sm:text-lg px-5 sm:px-6 font-bold font-[family-name:var(--font-space)] border-2 border-stone-900 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)]" variant="cta" asChild>
            <a href="https://udyomxorg.vercel.app/projects" target="_blank" rel="noopener noreferrer">
              View All Projects
              <ArrowRight className="ml-2 h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Education Section - Compact Neu-brutalism Style
function EducationSection({ education }: { education: Education[] }) {
  return (
    <section id="education" className="py-10 sm:py-12 md:py-14 lg:py-16 bg-amber-50/30">
      <div className="container mx-auto px-4 min-[480px]:px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 min-[480px]:gap-4 mb-6 min-[480px]:mb-8">
          <div className="p-2.5 sm:p-3 bg-amber-500 border-2 border-stone-900 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]">
            <GraduationCap className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2.5xl min-[480px]:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-space)]">Education</h2>
            <p className="text-sm min-[480px]:text-base sm:text-lg text-muted-foreground font-medium font-[family-name:var(--font-space)]">My academic journey</p>
          </div>
        </div>

        {/* Education Grid - Compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {education.map((edu) => {
            const isCurrent = !edu.end_date;
            const logoUrl = normalizeImageUrl(edu.logo_url);
            return (
            <Card key={edu.id} className="group bg-card overflow-hidden border-2 border-stone-900 rounded-lg p-4 sm:p-5" style={{ border: "3px solid #000", boxShadow: "inset -3px -3px 0px #808080, inset 3px 3px 0px #dfdfdf" }}>
              <div className="flex flex-col gap-3">
                {/* Top row: Icon + Logo + Degree */}
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon or Logo */}
                  {logoUrl ? (
                    <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 border-2 border-stone-900 bg-white overflow-hidden rounded">
                      <Image
                        src={logoUrl}
                        alt={edu.logo_alt || edu.institution}
                        fill
                        sizes="60px"
                        className="object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className={`p-2.5 shrink-0 border-2 border-stone-900 rounded ${
                      isCurrent 
                        ? 'bg-amber-400 text-stone-900' 
                        : 'bg-stone-200 text-stone-600'
                    }`}>
                      <GraduationCap className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <h3 className="font-bold text-base sm:text-lg leading-tight font-[family-name:var(--font-space)]">{edu.degree}</h3>
                        {edu.field_of_study && (
                          <p className="text-sm sm:text-base text-amber-600 font-semibold mt-0.5 font-[family-name:var(--font-space)]">{edu.field_of_study}</p>
                        )}
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] sm:text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 border border-stone-900 rounded shrink-0">NOW</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Institution name - full width, can wrap */}
                <p className="text-sm sm:text-base text-amber-700 font-semibold leading-snug font-[family-name:var(--font-space)]">{edu.institution}</p>
                
                {/* Details row */}
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  {edu.start_date && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    {new Date(edu.start_date).getFullYear()}{edu.end_date ? `–${new Date(edu.end_date).getFullYear()}` : '–Now'}
                  </span>
                  )}
                  {edu.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    {edu.location}
                  </span>
                  )}
                  {edu.grade && (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 border border-amber-300 rounded shrink-0">
                      <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      {edu.grade}
                    </span>
                  )}
                </div>
                
                {/* Certificate button */}
                {!isCurrent && (
                  <button className="mt-2 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-violet-700 bg-violet-100 px-2 py-1.5 border border-violet-300 rounded hover:bg-violet-200 transition-colors w-full">
                    <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
                    View Certificate
                  </button>
                )}
              </div>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Experience Section - Compact Neu-brutalism Style
function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="py-10 sm:py-12 md:py-14 lg:py-16">
      <div className="container mx-auto px-4 min-[480px]:px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 min-[480px]:gap-4 mb-6 min-[480px]:mb-8">
          <div className="p-2.5 sm:p-3 bg-sky-500 border-2 border-stone-900 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]">
            <Briefcase className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2.5xl min-[480px]:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-space)]">Experience</h2>
            <p className="text-sm min-[480px]:text-base sm:text-lg text-muted-foreground font-medium font-[family-name:var(--font-space)]">Professional journey & activities</p>
          </div>
        </div>

        {/* Experience Grid - Compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {experiences.map((exp) => {
            const isCurrent = !exp.end_date;
            const logoUrl = normalizeImageUrl(exp.logo_url);
            return (
            <Card key={exp.id} className="group bg-card overflow-hidden border-2 border-stone-900 rounded-lg p-4 sm:p-5" style={{ border: "3px solid #000", boxShadow: "inset -3px -3px 0px #808080, inset 3px 3px 0px #dfdfdf" }}>
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon or Logo */}
                {logoUrl ? (
                  <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 border-2 border-stone-900 bg-white overflow-hidden rounded">
                    <Image
                      src={logoUrl}
                      alt={exp.logo_alt || exp.company}
                      fill
                      sizes="60px"
                        className="object-contain p-1"
                      />
                  </div>
                ) : (
                  <div className={`p-2.5 shrink-0 border-2 border-stone-900 rounded ${
                    isCurrent 
                      ? 'bg-sky-400 text-white' 
                      : 'bg-stone-200 text-stone-600'
                  }`}>
                    <Briefcase className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base sm:text-lg leading-tight truncate font-[family-name:var(--font-space)]">{exp.title}</h3>
                    {isCurrent && (
                      <span className="text-[10px] sm:text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 border border-stone-900 rounded shrink-0">ACTIVE</span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-sky-700 font-semibold truncate font-[family-name:var(--font-space)]">{exp.company}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-2 font-[family-name:var(--font-space)]">{exp.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs sm:text-sm text-muted-foreground">
                    {exp.start_date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {new Date(exp.start_date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                      {exp.end_date ? `–${new Date(exp.end_date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}` : '–Now'}
                    </span>
                    )}
                    {exp.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {exp.location}
                    </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Contact Section - Compact Neu-brutalism Style
function ContactSection({ profile }: { profile: Profile }) {
  const linkedinUrl = profile.linkedin_url?.trim() || "https://www.linkedin.com/";
  const whatsappUrl = profile.whatsapp_url?.trim() || "https://wa.me/";

  return (
    <section id="contact" className="py-10 sm:py-12 md:py-14 lg:py-16 bg-amber-50/30">
      <div className="container mx-auto px-4 min-[480px]:px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 min-[480px]:gap-4 mb-6 min-[480px]:mb-8">
          <div className="p-2.5 sm:p-3 bg-pink-500 border-2 border-stone-900 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]">
            <Mail className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2.5xl min-[480px]:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-space)]">Let&apos;s Connect</h2>
            <p className="text-sm min-[480px]:text-base sm:text-lg text-muted-foreground font-medium font-[family-name:var(--font-space)]">Open for collaborations & opportunities</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 min-[480px]:gap-4">
          <Button size="sm" className="text-sm sm:text-base px-4 sm:px-5 font-bold font-[family-name:var(--font-space)] border-2 border-stone-900 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)]" variant="cta" asChild>
            <Link href={`mailto:${profile.email}`}>
              <Mail className="mr-2 h-4.5 w-4.5 sm:h-5 sm:w-5" />
              Email Me
            </Link>
          </Button>
          <Button size="sm" className="text-sm sm:text-base px-4 sm:px-5 font-bold font-[family-name:var(--font-space)] border-2 border-stone-900 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)]" variant="cta-blue" asChild>
            <Link href={linkedinUrl} target="_blank">
              <Linkedin className="mr-2 h-4.5 w-4.5 sm:h-5 sm:w-5" />
              LinkedIn
            </Link>
          </Button>
          <Button size="sm" className="text-sm sm:text-base px-4 sm:px-5 font-bold font-[family-name:var(--font-space)] border-2 border-stone-900 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)]" variant="cta-green" asChild>
            <Link href={whatsappUrl} target="_blank">
              WhatsApp
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default async function HomePage() {
  // Fetch all data from Supabase
  const { profile, projects, education, experiences, heroCarousel } = await getHomePageData();

  return (
    <>
      <HeroSection profile={profile} heroCarousel={heroCarousel} />
      <SkillsSection />
      <FeaturedProjects projects={projects} />
      <EducationSection education={education} />
      <ExperienceSection experiences={experiences} />
      <ContactSection profile={profile} />
    </>
  );
}
