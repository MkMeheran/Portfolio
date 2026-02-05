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
// react-icons imports
import { SiQgis, SiPython, SiJavascript, SiHtml5, SiCss3, SiCanva } from "react-icons/si";
import { FaDatabase, FaVideo, FaMapMarkedAlt, FaFileWord, FaFileExcel, FaFilePowerpoint, FaGlobe, FaCode, FaPaintBrush, FaChartBar } from "react-icons/fa";
import { BiData, BiMoviePlay } from "react-icons/bi";
import { InfiniteCarousel } from "@/components/ui/infinite-carousel";
import { SkillsSection } from "@/components/sections/skills-section";
import type { Profile, Education, Experience, Project, HeroCarousel } from "@/types/database.types";

// Hero Section - Facebook/LinkedIn style with proper sizing
function HeroSection({ profile, heroCarousel }: { profile: Profile; heroCarousel: HeroCarousel[] }) {
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
      {/* Cover Image - Fixed height */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 bg-linear-to-br from-amber-200 via-amber-100 to-orange-100 border-b-4 border-foreground/10">
        <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-8 left-8 w-28 h-28 border-4 border-amber-400/40 rotate-12" />
          <div className="absolute top-12 right-12 w-24 h-24 border-4 border-orange-400/40 rounded-full" />
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-amber-400/25 -rotate-6" />
          <div className="absolute top-20 right-1/3 w-16 h-16 bg-orange-400/30 rounded-full" />
        </div>
      </div>

      {/* Profile Content - Below cover */}
      {/* Breakpoints: mobile(<480), mobile-tablet(480-640), tablet(640-768), tablet-desktop(768-1024), desktop(>1024) */}
      <div className="container mx-auto px-3 min-[480px]:px-4 sm:px-5 lg:px-6">
        {/* Photo + All Content */}
        <div className="flex flex-row gap-3 min-[480px]:gap-4 sm:gap-5 md:gap-6 lg:gap-10">
          {/* Profile Picture */}
          <div className="shrink-0 -mt-9 min-[480px]:-mt-10 sm:-mt-12 md:-mt-14 lg:-mt-15 relative z-10">
            <div className="relative h-32 w-32 min-[480px]:h-36 min-[480px]:w-36 sm:h-44 sm:w-44 md:h-52 md:w-52 lg:h-60 lg:w-60 border-4 border-background bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden">
              <Image
                src={profile.avatar_url || "/placeholder-avatar.jpg"}
                alt={profile.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* All Content - Right of photo */}
          <div className="flex-1 min-w-0 pt-1 min-[480px]:pt-2">
            {/* Name */}
            <h1 className="text-xl min-[480px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground font-[family-name:var(--font-space)]">
              {profile.name}
            </h1>
            
            {/* Title and Location - reduced spacing */}
            <div className="flex items-center gap-1 min-[480px]:gap-1.5 sm:gap-2 flex-wrap text-xs min-[480px]:text-sm sm:text-base md:text-lg text-foreground/80 mt-0.5 mb-1.5 min-[480px]:mb-2 sm:mb-3 font-[family-name:var(--font-space)]">
              <span className="flex items-center gap-0.5 min-[480px]:gap-1">
                <GraduationCap className="h-3 w-3 min-[480px]:h-3.5 min-[480px]:w-3.5 sm:h-4 sm:w-4 text-amber-600 shrink-0" />
                <span className="whitespace-nowrap">{profile.title}</span>
              </span>
              <span className="text-foreground/30">•</span>
              <span className="flex items-center gap-0.5 min-[480px]:gap-1">
                <MapPin className="h-3 w-3 min-[480px]:h-3.5 min-[480px]:w-3.5 sm:h-4 sm:w-4 shrink-0" />
                {profile.location}
              </span>
            </div>

            {/* Bio - Shows from mobile-tablet (480px+) */}
            <p className="hidden min-[480px]:block text-sm min-[480px]:text-sm sm:text-base md:text-lg text-foreground/70 max-w-2xl mb-2 min-[480px]:mb-3 sm:mb-4 leading-snug sm:leading-normal">
              Bridging urban planning with technology — spatial thinking meets modern development. Building digital solutions with AI, GIS, and Web Dev.
            </p>

            {/* Buttons + Social - Always in same row, shows from tablet-desktop (768px+) */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
              <Button size="default" className="h-8 lg:h-10 text-xs lg:text-sm px-2.5 lg:px-4 font-bold font-[family-name:var(--font-space)]" variant="cta" asChild>
                <Link href="/projects">
                  <Target className="mr-1 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  Projects
                </Link>
              </Button>
              <Button size="default" className="h-8 lg:h-10 text-xs lg:text-sm px-2.5 lg:px-4 font-bold font-[family-name:var(--font-space)]" variant="outline" asChild>
                <Link href="/cv.pdf" target="_blank">
                  <Download className="mr-1 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  Resume
                </Link>
              </Button>
              <Button size="default" className="h-8 lg:h-10 text-xs lg:text-sm px-2.5 lg:px-4 font-bold font-[family-name:var(--font-space)]" variant="cta-green" asChild>
                <Link href={`mailto:${profile.email}`}>
                  <Mail className="mr-1 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  Contact
                </Link>
              </Button>
              <div className="flex items-center gap-1.5 lg:gap-2">
                <Link href={profile.github_url || "#"} target="_blank" className="p-1.5 lg:p-2.5 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  <Github className="h-4 w-4 lg:h-5 lg:w-5" />
                </Link>
                <Link href={profile.linkedin_url || "#"} target="_blank" className="p-1.5 lg:p-2.5 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  <Linkedin className="h-4 w-4 lg:h-5 lg:w-5" />
                </Link>
                <Link href={profile.facebook_url || "#"} target="_blank" className="p-1.5 lg:p-2.5 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  <Facebook className="h-4 w-4 lg:h-5 lg:w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Below photo: Buttons + Social for mobile to tablet (< 768px) */}
        <div className="md:hidden mt-3 min-[480px]:mt-4">
          {/* Bio - Only on pure mobile (< 480px) */}
          <p className="min-[480px]:hidden text-xs text-foreground/70 mb-3 leading-snug">
            Bridging urban planning with technology — spatial thinking meets modern development. Building digital solutions with AI, GIS, and Web Dev.
          </p>
          
          {/* Buttons + Social in same row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="default" className="h-9 text-sm px-3 font-bold font-[family-name:var(--font-space)]" variant="cta" asChild>
              <Link href="/projects">
                <Target className="mr-1.5 h-4 w-4" />
                Projects
              </Link>
            </Button>
            <Button size="default" className="h-9 text-sm px-3 font-bold font-[family-name:var(--font-space)]" variant="outline" asChild>
              <Link href="/cv.pdf" target="_blank">
                <Download className="mr-1.5 h-4 w-4" />
                Resume
              </Link>
            </Button>
            <Button size="default" className="h-9 text-sm px-3 font-bold font-[family-name:var(--font-space)]" variant="cta-green" asChild>
              <Link href={`mailto:${profile.email}`}>
                <Mail className="mr-1.5 h-4 w-4" />
                Contact
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Link href={profile.github_url || "#"} target="_blank" className="p-2 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <Github className="h-5 w-5" />
              </Link>
              <Link href={profile.linkedin_url || "#"} target="_blank" className="p-2 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href={profile.facebook_url || "#"} target="_blank" className="p-2 bg-card border-2 border-stone-900 text-muted-foreground hover:text-foreground shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Infinite Carousel - Full width */}
        <div className="py-6 min-[480px]:py-8 sm:py-10">
          <h3 className="text-base font-black text-muted-foreground mb-3 font-[family-name:var(--font-space)]">Roles, Interests & Achievements</h3>
          {carouselLine1.length > 0 && <InfiniteCarousel items={carouselLine1} direction="left" speed="normal" />}
          <div className="h-3" />
          {carouselLine2.length > 0 && <InfiniteCarousel items={carouselLine2} direction="right" speed="slow" />}
        </div>
      </div>
    </section>
  );
}

// Category badges config
const categoryBadges: Record<string, { label: string; class: string }> = {
  gis: { label: "GIS", class: "bg-emerald-500 text-white" },
  web: { label: "Web", class: "bg-sky-500 text-white" },
  ai: { label: "AI", class: "bg-pink-500 text-white" },
  planning: { label: "Planning", class: "bg-amber-500 text-stone-900" },
};

// Featured Projects - Small cards, limited rows by screen size
function FeaturedProjects({ projects }: { projects: Project[] }) {
  const allFeaturedProjects = projects.filter((p) => p.is_featured);
  // Desktop/tablet: 2 rows max (10 projects for 5-col, 8 for 4-col, 6 for 3-col)
  // Mobile: 3 rows max (6 projects for 2-col)
  const featuredProjects = allFeaturedProjects.slice(0, 10);

  return (
    <section id="projects" className="py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-sky-500 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space)]">Featured Projects</h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium font-[family-name:var(--font-space)]">Showcasing my best work</p>
          </div>
        </div>

        {/* Grid with row limits: mobile 3 rows (6), tablet 2 rows (6-8), desktop 2 rows (10) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
          {featuredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className={`overflow-hidden group bg-card border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all
                ${index >= 6 ? 'hidden sm:block' : ''}
                ${index >= 8 ? 'hidden md:block' : ''}
              `}
            >
              {/* Image - Small */}
              <div className="relative w-full h-20 sm:h-24 bg-amber-50 border-b-2 border-stone-900 overflow-hidden">
                {project.thumbnail_url ? (
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {project.category === "gis" && <MapPin className="h-8 w-8 text-emerald-500/30" />}
                    {project.category === "web" && <Code className="h-8 w-8 text-sky-500/30" />}
                    {project.category === "ai" && <Brain className="h-8 w-8 text-pink-500/30" />}
                    {project.category === "planning" && <Target className="h-8 w-8 text-amber-500/30" />}
                  </div>
                )}
                {/* Category badge */}
                {project.category && (
                <div className={`absolute top-1 left-1 text-[8px] font-bold px-1 py-0.5 border border-stone-900 ${categoryBadges[project.category]?.class || 'bg-stone-200'} font-[family-name:var(--font-space)]`}>
                  {categoryBadges[project.category]?.label || project.category}
                </div>
                )}
                {/* Links on hover */}
                <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.live_url && (
                    <Link href={project.live_url} target="_blank" className="p-0.5 bg-white border border-stone-900 text-stone-700 hover:bg-stone-100">
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                  {project.github_url && (
                    <Link href={project.github_url} target="_blank" className="p-0.5 bg-white border border-stone-900 text-stone-700 hover:bg-stone-100">
                      <Github className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Content - Minimal */}
              <CardContent className="p-2">
                <h3 className="font-bold text-xs sm:text-sm md:text-base leading-tight group-hover:text-amber-700 transition-colors font-[family-name:var(--font-space)] line-clamp-1 mb-1">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-0.5">
                  {(project.technologies || []).slice(0, 2).map((tech) => (
                    <span key={tech} className="text-[9px] sm:text-[10px] md:text-xs font-medium text-stone-600 bg-stone-100 border border-stone-200 px-1 py-0.5 font-[family-name:var(--font-space-mono)]">
                      {tech}
                    </span>
                  ))}
                  {(project.technologies || []).length > 2 && (
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold">+{(project.technologies || []).length - 2}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button - Centered */}
        <div className="mt-4 flex justify-center">
          <Button size="sm" className="text-xs font-bold font-[family-name:var(--font-space)] border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5" variant="cta" asChild>
            <a href="https://udyomxorg.vercel.app/projects" target="_blank" rel="noopener noreferrer">
              View All Projects
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
    <section id="education" className="py-8 bg-amber-50/30">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space)]">Education</h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium font-[family-name:var(--font-space)]">My academic journey</p>
          </div>
        </div>

        {/* Education Grid - Compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {education.map((edu) => {
            const isCurrent = !edu.end_date;
            return (
            <Card key={edu.id} className="group bg-card overflow-hidden border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  {/* Icon or Logo */}
                  {edu.logo_url ? (
                    <div className="relative h-10 w-10 shrink-0 border-2 border-stone-900 bg-white overflow-hidden">
                      <Image
                        src={edu.logo_url}
                        alt={edu.logo_alt || edu.institution}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className={`p-2 shrink-0 border-2 border-stone-900 ${
                      isCurrent 
                        ? 'bg-amber-400 text-stone-900' 
                        : 'bg-stone-200 text-stone-600'
                    }`}>
                      <GraduationCap className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-sm sm:text-base leading-tight truncate font-[family-name:var(--font-space)]">{edu.degree}</h3>
                      {isCurrent && (
                        <span className="text-[9px] font-bold bg-emerald-400 text-white px-1.5 py-0.5 border border-stone-900 shrink-0">NOW</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-amber-700 font-semibold truncate font-[family-name:var(--font-space)]">{edu.institution}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] sm:text-xs text-muted-foreground">
                      {edu.start_date && (
                      <span className="inline-flex items-center gap-0.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(edu.start_date).getFullYear()}{edu.end_date ? `–${new Date(edu.end_date).getFullYear()}` : '–Now'}
                      </span>
                      )}
                      {edu.location && (
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {edu.location}
                      </span>
                      )}
                      {edu.grade && (
                        <span className="inline-flex items-center gap-0.5 font-bold text-amber-700 bg-amber-100 px-1 py-0.5 border border-amber-300">
                          <Trophy className="h-3 w-3" />
                          {edu.grade}
                        </span>
                      )}
                    </div>
                    
                    {/* Certificate Icon - shows on hover or always if not current */}
                    {!isCurrent && (
                      <button className="mt-2 flex items-center gap-1 text-[9px] font-bold text-violet-700 bg-violet-100 px-1.5 py-0.5 border border-violet-300 hover:bg-violet-200 transition-colors">
                        <FileText className="h-3 w-3" />
                        View Certificate
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
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
    <section id="experience" className="py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-sky-500 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space)]">Experience</h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium font-[family-name:var(--font-space)]">Professional journey & activities</p>
          </div>
        </div>

        {/* Experience Grid - Compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {experiences.map((exp) => {
            const isCurrent = !exp.end_date;
            return (
            <Card key={exp.id} className="group bg-card overflow-hidden border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  {/* Icon or Logo */}
                  {exp.logo_url ? (
                    <div className="relative h-10 w-10 shrink-0 border-2 border-stone-900 bg-white overflow-hidden">
                      <Image
                        src={exp.logo_url}
                        alt={exp.logo_alt || exp.organization}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className={`p-2 shrink-0 border-2 border-stone-900 ${
                      isCurrent 
                        ? 'bg-sky-400 text-white' 
                        : 'bg-stone-200 text-stone-600'
                    }`}>
                      <Briefcase className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-sm sm:text-base leading-tight truncate font-[family-name:var(--font-space)]">{exp.title}</h3>
                      {isCurrent && (
                        <span className="text-[9px] font-bold bg-emerald-400 text-white px-1.5 py-0.5 border border-stone-900 shrink-0">ACTIVE</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-sky-700 font-semibold truncate font-[family-name:var(--font-space)]">{exp.company}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mt-1 font-[family-name:var(--font-space)]">{exp.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] sm:text-xs text-muted-foreground">
                      {exp.start_date && (
                      <span className="inline-flex items-center gap-0.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(exp.start_date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                        {exp.end_date ? `–${new Date(exp.end_date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}` : '–Now'}
                      </span>
                      )}
                      {exp.location && (
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
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
  return (
    <section id="contact" className="py-8 bg-amber-50/30">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-500 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space)]">Let&apos;s Connect</h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium font-[family-name:var(--font-space)]">Open for collaborations & opportunities</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button className="text-xs sm:text-sm font-bold font-[family-name:var(--font-space)] border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5" variant="cta" asChild>
            <Link href={`mailto:${profile.email}`}>
              <Mail className="mr-1.5 h-4 w-4" />
              Email Me
            </Link>
          </Button>
          <Button className="text-xs sm:text-sm font-bold font-[family-name:var(--font-space)] border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5" variant="cta-blue" asChild>
            <Link href={profile.linkedin_url || "#"} target="_blank">
              <Linkedin className="mr-1.5 h-4 w-4" />
              LinkedIn
            </Link>
          </Button>
          <Button className="text-xs sm:text-sm font-bold font-[family-name:var(--font-space)] border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5" variant="cta-green" asChild>
            <Link href={profile.whatsapp_url || "#"} target="_blank">
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
