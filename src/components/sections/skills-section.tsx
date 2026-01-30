"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Brain,
  Code,
  Award,
  Eye,
  X,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Skill, Certificate, Tool } from "@/types/database.types";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "@icons-pack/react-simple-icons";

// react-icons imports (fallback icons)
import { SiQgis, SiPython, SiJavascript, SiHtml5, SiCss3, SiCanva } from "react-icons/si";
import { FaDatabase, FaVideo, FaMapMarkedAlt, FaFileWord, FaFileExcel, FaFilePowerpoint, FaGlobe, FaCode, FaPaintBrush, FaChartBar, FaCog } from "react-icons/fa";
import { BiMoviePlay } from "react-icons/bi";

// Icon mapping for skills
const skillIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "geospatial": FaGlobe,
  "sql": FaDatabase,
  "python": SiPython,
  "web": FaCode,
  "excel": FaChartBar,
  "video": BiMoviePlay,
  "design": FaPaintBrush,
  "default": FaCog,
};

// Icon mapping for tools  
const toolIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "python": SiPython,
  "qgis": SiQgis,
  "arcgis": FaMapMarkedAlt,
  "sql": FaDatabase,
  "javascript": SiJavascript,
  "html": SiHtml5,
  "css": SiCss3,
  "excel": FaFileExcel,
  "word": FaFileWord,
  "powerpoint": FaFilePowerpoint,
  "canva": SiCanva,
  "capcut": FaVideo,
  "default": FaCog,
};

// Extended Skill type with certificates
interface SkillWithCertificates extends Skill {
  certificates?: Certificate[];
}

// Fallback static data
const fallbackTools = [
  { name: "Python", icon: SiPython, color: "text-stone-900", bg: "bg-yellow-400", size: "lg" },
  { name: "QGIS", icon: SiQgis, color: "text-stone-900", bg: "bg-green-400", size: "md" },
  { name: "ArcGIS", icon: FaMapMarkedAlt, color: "text-white", bg: "bg-blue-600", size: "sm" },
  { name: "SQL", icon: FaDatabase, color: "text-white", bg: "bg-orange-500", size: "md" },
  { name: "JavaScript", icon: SiJavascript, color: "text-stone-900", bg: "bg-yellow-300", size: "sm" },
  { name: "HTML", icon: SiHtml5, color: "text-white", bg: "bg-orange-600", size: "sm" },
  { name: "CSS", icon: SiCss3, color: "text-white", bg: "bg-blue-500", size: "sm" },
  { name: "MS Excel", icon: FaFileExcel, color: "text-white", bg: "bg-green-600", size: "md" },
  { name: "MS Word", icon: FaFileWord, color: "text-white", bg: "bg-blue-700", size: "sm" },
  { name: "PowerPoint", icon: FaFilePowerpoint, color: "text-white", bg: "bg-red-500", size: "sm" },
  { name: "SPSS", icon: FaDatabase, color: "text-white", bg: "bg-rose-600", size: "sm" },
  { name: "Canva", icon: SiCanva, color: "text-white", bg: "bg-violet-500", size: "md" },
  { name: "CapCut", icon: FaVideo, color: "text-white", bg: "bg-pink-500", size: "sm" },
];

const fallbackSkills = [
  {
    name: "Geospatial Data Analysis",
    hasCert: true,
    icon: FaGlobe,
    bg: "bg-emerald-500",
    subSkills: ["QGIS Mapping", "Remote Sensing", "Spatial Analysis", "Cartography", "GeoJSON/Shapefile"],
    certificates: [],
  },
  {
    name: "Data Analysis with SQL",
    hasCert: true,
    icon: FaDatabase,
    bg: "bg-orange-500",
    subSkills: ["PostgreSQL", "MySQL", "Data Queries", "Database Design", "Data Cleaning"],
    certificates: [],
  },
  {
    name: "Data Analysis with Python",
    hasCert: true,
    icon: SiPython,
    bg: "bg-yellow-500",
    subSkills: ["Pandas", "NumPy", "Matplotlib", "Data Visualization", "Automation"],
    certificates: [],
  },
  {
    name: "Full Stack Web Dev",
    hasCert: true,
    icon: FaCode,
    bg: "bg-violet-500",
    subSkills: ["React/Next.js", "TypeScript", "Tailwind CSS", "Node.js", "REST APIs"],
    certificates: [],
  },
  {
    name: "Word & Excel Mastery",
    hasCert: false,
    icon: FaChartBar,
    bg: "bg-blue-500",
    subSkills: ["Advanced Formulas", "Pivot Tables", "Document Formatting", "Data Analysis", "Macros"],
    certificates: [],
  },
  {
    name: "Video Editing",
    hasCert: false,
    icon: BiMoviePlay,
    bg: "bg-pink-500",
    subSkills: ["CapCut Pro", "Color Grading", "Motion Graphics", "Audio Sync", "Transitions"],
    certificates: [],
  },
  {
    name: "Poster Design",
    hasCert: false,
    icon: FaPaintBrush,
    bg: "bg-rose-500",
    subSkills: ["Canva Design", "Typography", "Layout", "Color Theory", "Branding"],
    certificates: [],
  },
];

// Helper to get icon from name
function getSkillIcon(name: string): React.ComponentType<{ className?: string }> {
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(skillIconMap)) {
    if (lowerName.includes(key)) return skillIconMap[key];
  }
  return skillIconMap.default;
}

function getToolIcon(name: string): React.ComponentType<{ className?: string }> {
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(toolIconMap)) {
    if (lowerName.includes(key)) return toolIconMap[key];
  }
  return toolIconMap.default;
}

// Helper to get icon component from database icon field
function getIconComponent(iconName: string | null): React.ComponentType<{ className?: string }> | null {
  if (!iconName) return null;
  
  try {
    if (iconName.startsWith('brand:')) {
      // Brand icon (Simple Icons)
      const brandName = iconName.replace('brand:', '');
      const pascalName = "Si" + brandName.charAt(0).toUpperCase() + brandName.slice(1)
        .replace("dotjs", "Dotjs")
        .replace("dotnet", "Dotnet")
        .replace("plusplus", "Plusplus");
      return (SimpleIcons as any)[pascalName] || null;
    } else {
      // Lucide icon
      return (LucideIcons as any)[iconName] || null;
    }
  } catch {
    return null;
  }
}

export function SkillsSection() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillWithCertificates | null>(null);
  const [skills, setSkills] = useState<SkillWithCertificates[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      // Fetch skills with certificates
      const { data: skillsData } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });
      
      // Fetch certificates
      const { data: certsData } = await supabase
        .from("certificates")
        .select("*")
        .order("display_order", { ascending: true });
      
      // Fetch tools
      const { data: toolsData } = await supabase
        .from("tools")
        .select("*")
        .order("display_order", { ascending: true });

      // Merge certificates with skills
      if (skillsData) {
        const skillsWithCerts = skillsData.map((skill) => ({
          ...skill,
          certificates: certsData?.filter((cert) => cert.skill_id === skill.id) || [],
        }));
        setSkills(skillsWithCerts);
      }

      if (toolsData) {
        setTools(toolsData);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, []);

  const openDetails = (skill: SkillWithCertificates) => {
    setSelectedSkill(skill);
    setShowDetails(true);
  };

  // Always use database data - no fallback
  const displaySkills = skills;
  const displayTools = tools;

  return (
    <>
      <section id="skills" className="py-10 bg-gradient-to-b from-amber-50/50 to-transparent">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          {/* Section Header - Neu-brutalism */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-400 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
                <Target className="h-5 w-5 text-stone-900" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space)]">Skills & Tools</h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium font-[family-name:var(--font-space)]">Technologies and expertise I bring</p>
              </div>
            </div>
            
            {/* Show Details Button */}
            <Button
              onClick={() => setShowDetails(true)}
              className="border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline font-bold text-xs">Show Details</span>
            </Button>
          </div>

          <div className="grid gap-3 lg:grid-cols-5">
            {/* Skills List - Neu-brutalism Card (First) */}
            <Card className="lg:col-span-2 bg-fuchsia-50 border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917] overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-fuchsia-400 border-2 border-stone-900">
                    <Brain className="h-4 w-4 text-stone-900" />
                  </div>
                  <h3 className="font-black text-base tracking-tight font-[family-name:var(--font-space)]">What I Can Do</h3>
                </div>
                <div className="space-y-1.5">
                  {loading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : displaySkills.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      <p className="text-sm">কোনো দক্ষতা যোগ করা হয়নি</p>
                      <p className="text-xs">Admin Panel থেকে দক্ষতা যোগ করুন</p>
                    </div>
                  ) : (
                    displaySkills.map((skill) => {
                      const SkillIcon = getSkillIcon(skill.name);
                      const bgColor = skill.bg_color ? `bg-${skill.bg_color}` : "bg-emerald-500";
                      return (
                        <div
                          key={skill.id}
                          onClick={() => openDetails(skill)}
                          className="group relative flex items-center gap-2 p-2 bg-white border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 cursor-pointer overflow-hidden"
                        >
                          {/* Cyberpunk scanline effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-fuchsia-400/20" />
                          </div>
                          <div className={`relative z-10 p-1.5 ${bgColor} border-2 border-stone-900`}>
                            <SkillIcon className="h-4 w-4 text-white" />
                          </div>
                          <span className="relative z-10 text-sm sm:text-base font-bold flex-1 text-stone-800 font-[family-name:var(--font-space)]">{skill.name}</span>
                          {skill.has_certificates && (
                            <span className="relative z-10 flex items-center gap-0.5 text-xs font-bold bg-amber-400 text-stone-900 px-1.5 py-0.5 border-2 border-stone-900 shadow-[1px_1px_0px_0px_#1c1917] shrink-0">
                              <Award className="h-3 w-3" />
                              <span className="hidden sm:inline">Cert</span>
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tools Bento Grid (Second) */}
            <Card className="lg:col-span-3 bg-stone-50 border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917] overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-lime-400 border-2 border-stone-900">
                    <Code className="h-4 w-4 text-stone-900" />
                  </div>
                  <h3 className="font-black text-base tracking-tight font-[family-name:var(--font-space)]">Tools I Use</h3>
                  <span className="ml-auto text-xs font-bold text-stone-900 bg-lime-300 px-1.5 py-0.5 border-2 border-stone-900">{displayTools.length}</span>
                </div>
                {/* Bento Grid */}
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : displayTools.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="text-sm">কোনো টুল যোগ করা হয়নি</p>
                    <p className="text-xs">Admin Panel থেকে টুল যোগ করুন</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                    {displayTools.map((tool) => {
                      // Try to get icon from database first, then fallback to name mapping
                      const DatabaseIcon = tool.icon ? getIconComponent(tool.icon) : null;
                      const FallbackIcon = getToolIcon(tool.name);
                      const ToolIcon = DatabaseIcon || FallbackIcon;
                      
                      const gridSize = tool.grid_size || "1x1";
                      const sizeClass = gridSize === "2x2" ? "lg" : gridSize === "2x1" ? "md" : "sm";
                      // Define colorful Bento grid palette
                      const colorPalette = [
                        "bg-yellow-400", "bg-green-500", "bg-blue-500", "bg-red-500", 
                        "bg-violet-500", "bg-pink-500", "bg-orange-500", "bg-cyan-500",
                        "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-teal-500",
                        "bg-indigo-500"
                      ];
                      // Assign color based on index for variety
                      const toolBg = colorPalette[displayTools.indexOf(tool) % colorPalette.length];
                      const toolColor = ["bg-yellow-400", "bg-yellow-300", "bg-cyan-500", "bg-amber-500"].includes(toolBg) ? "text-stone-900" : "text-white";
                      
                      return (
                        <div
                          key={tool.id}
                          className={`group relative flex flex-col items-center justify-center ${toolBg} border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 cursor-pointer overflow-hidden
                            ${sizeClass === "lg" ? "col-span-2 row-span-2 p-4" : ""}
                            ${sizeClass === "md" ? "col-span-2 p-2.5" : ""}
                            ${sizeClass === "sm" ? "col-span-1 p-2" : ""}
                          `}
                        >
                          {tool.icon_url ? (
                            <Image
                              src={tool.icon_url}
                              alt={tool.icon_alt || tool.name}
                              width={sizeClass === "lg" ? 56 : sizeClass === "md" ? 32 : 24}
                              height={sizeClass === "lg" ? 56 : sizeClass === "md" ? 32 : 24}
                              className="group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <ToolIcon className={`${toolColor} group-hover:scale-110 transition-transform
                              ${sizeClass === "lg" ? "h-12 w-12 sm:h-14 sm:w-14" : ""}
                              ${sizeClass === "md" ? "h-7 w-7 sm:h-8 sm:w-8" : ""}
                              ${sizeClass === "sm" ? "h-5 w-5 sm:h-6 sm:w-6" : ""}
                            `} />
                          )}
                          <span className={`font-bold text-center leading-tight ${toolColor} font-[family-name:var(--font-space-mono)]
                            ${sizeClass === "lg" ? "text-base sm:text-lg mt-2" : ""}
                            ${sizeClass === "md" ? "text-xs sm:text-sm mt-1" : ""}
                            ${sizeClass === "sm" ? "text-[10px] sm:text-xs mt-0.5" : ""}
                          `}>{tool.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowDetails(false)}>
          <div 
            className="bg-white border-2 border-stone-900 shadow-[6px_6px_0px_0px_#1c1917] w-full max-h-[85vh] overflow-y-auto"
            style={{
              minWidth: 'min(400px, 65vh)',
              maxWidth: 'min(672px, 42.5vh)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-fuchsia-500 to-violet-500 p-4 border-b-2 border-stone-900 flex items-center justify-between">
              <h3 className="text-lg font-black text-white font-[family-name:var(--font-space)]">
                {selectedSkill ? selectedSkill.name : "All Skills & Certifications"}
              </h3>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedSkill(null);
                }}
                className="p-1 bg-white border-2 border-stone-900 hover:bg-stone-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {selectedSkill ? (
                // Single Skill View with Multiple Certificates
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const SkillIcon = getSkillIcon(selectedSkill.name);
                      const bgColor = selectedSkill.bg_color ? `bg-${selectedSkill.bg_color}` : "bg-emerald-500";
                      return (
                        <div className={`p-2 ${bgColor} border-2 border-stone-900`}>
                          <SkillIcon className="h-6 w-6 text-white" />
                        </div>
                      );
                    })()}
                    <div>
                      <h4 className="font-black text-lg font-[family-name:var(--font-space)]">{selectedSkill.name}</h4>
                      {selectedSkill.has_certificates && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Certified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 1. Skills Included */}
                  {selectedSkill.sub_skills && selectedSkill.sub_skills.length > 0 && (
                    <div>
                      <h5 className="text-sm font-bold mb-2 text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Skills Included
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSkill.sub_skills.map((sub, idx) => {
                          const bgColor = selectedSkill.bg_color ? `bg-${selectedSkill.bg_color}` : "bg-emerald-500";
                          return (
                            <span
                              key={idx}
                              className={`text-xs font-bold px-2 py-1 border-2 border-stone-900 ${bgColor} text-white`}
                            >
                              {sub}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Certificates */}
                  {selectedSkill.certificates && selectedSkill.certificates.length > 0 && (
                    <div>
                      <h5 className="text-sm font-bold mb-2 text-muted-foreground flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-500" />
                        Certificates ({selectedSkill.certificates.length})
                      </h5>
                      <div className="space-y-3">
                        {selectedSkill.certificates.map((cert, idx) => (
                          <div key={cert.id} className="relative bg-gradient-to-br from-amber-100 to-purple-100 border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] p-3">
                            
                            {/* Certificate Title - Center */}
                            <h6 className="text-center text-xl md:text-2xl font-bold text-stone-900 font-[family-name:var(--font-space-mono)] mb-1 tracking-tight">
                              {cert.title}
                            </h6>

                            {/* Provider */}
                            {cert.issuer && (
                              <p className="text-left text-xs text-stone-600 font-medium mb-2">
                                By {cert.issuer}
                              </p>
                            )}

                            {/* Certificate Image - 16:9 */}
                            {cert.image_url && (
                              <div className="relative bg-white border border-stone-900 mb-2 overflow-hidden"
                                style={{
                                  aspectRatio: '16/9',
                                }}
                              >
                                <Image
                                  src={cert.image_url}
                                  alt={cert.image_alt || `${cert.title} Certificate`}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                            )}

                            {/* Date & Credential ID & Verify Button - Below Picture */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                {cert.issue_date && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-300 border border-stone-900 text-stone-900 font-bold">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(cert.issue_date).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'short'
                                    })}
                                  </div>
                                )}
                                {cert.credential_id && (
                                  <span className="text-[10px] text-stone-600 font-medium">
                                    ID: {cert.credential_id}
                                  </span>
                                )}
                              </div>
                              {cert.credential_url && (
                                <Link
                                  href={cert.credential_url}
                                  target="_blank"
                                  className="flex items-center gap-1 px-2 py-1 bg-amber-400 text-stone-900 text-[10px] font-black border border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                  style={{ borderRadius: '6%' }}
                                >
                                  <ExternalLink className="h-2.5 w-2.5" />
                                  VERIFY
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Capabilities */}
                  {selectedSkill.sub_skills && selectedSkill.sub_skills.length > 0 && (
                    <div>
                      <h5 className="text-sm font-bold mb-2 text-muted-foreground flex items-center gap-2">
                        <Award className="h-4 w-4 text-violet-500" />
                        Capabilities
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedSkill.sub_skills.map((sub, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 bg-stone-50 border border-stone-200 text-stone-700 text-sm font-medium flex items-center gap-2 hover:border-stone-400 transition-colors"
                          >
                            <ChevronRight className="h-3 w-3 text-amber-500" />
                            {sub}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedSkill(null)}
                    variant="outline"
                    className="w-full border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none"
                  >
                    ← Back to All Skills
                  </Button>
                </div>
              ) : (
                // All Skills List
                <div className="space-y-3">
                  {displaySkills.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p className="text-sm">কোনো দক্ষতা যোগ করা হয়নি</p>
                      <p className="text-xs">Admin Panel থেকে দক্ষতা যোগ করুন</p>
                    </div>
                  ) : (
                    displaySkills.map((skill) => {
                      const SkillIcon = getSkillIcon(skill.name);
                      const bgColor = skill.bg_color ? `bg-${skill.bg_color}` : "bg-emerald-500";
                      return (
                        <div
                          key={skill.id}
                          onClick={() => setSelectedSkill(skill)}
                          className={`group flex items-center gap-3 p-3 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer ${bgColor}/10`}
                        >
                          <div className={`p-2 ${bgColor} border-2 border-stone-900`}>
                            <SkillIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-base sm:text-lg font-[family-name:var(--font-space)]">{skill.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {(skill.sub_skills || []).slice(0, 3).join(" • ")}
                            </p>
                          </div>
                          {skill.has_certificates && skill.certificates && skill.certificates.length > 0 && (
                            <span className="text-[10px] font-bold bg-amber-400 text-stone-900 px-2 py-1 border-2 border-stone-900">
                              <Award className="h-3 w-3 inline mr-1" />
                              {skill.certificates.length} CERT
                            </span>
                          )}
                          <ChevronRight className="h-5 w-5 text-stone-400 group-hover:text-stone-900" />
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
