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

// react-icons imports (fallback icons)
import { SiQgis, SiPython, SiJavascript, SiHtml5, SiCss3, SiCanva, SiPostgresql, SiMysql, SiTableau, SiDatabricks, SiApachespark } from "react-icons/si";
import { FaDatabase, FaVideo, FaMapMarkedAlt, FaFileWord, FaFileExcel, FaFilePowerpoint, FaGlobe, FaCode, FaPaintBrush, FaChartBar, FaCog, FaTruck, FaWarehouse, FaShippingFast, FaIndustry, FaMapMarked, FaChartLine, FaBrain, FaRobot } from "react-icons/fa";
import { BiMoviePlay, BiData } from "react-icons/bi";
import { TbTruckDelivery, TbMapSearch } from "react-icons/tb";
import { MdAnalytics, MdScience } from "react-icons/md";

// Icon mapping for skills
const skillIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "geospatial": FaGlobe,
  "gis": FaMapMarked,
  "mapping": TbMapSearch,
  "spatial": FaMapMarkedAlt,
  "sql": FaDatabase,
  "database": FaDatabase,
  "python": SiPython,
  "web": FaCode,
  "video": BiMoviePlay,
  "design": FaPaintBrush,
  "supply chain": FaTruck,
  "logistics": FaShippingFast,
  "warehouse": FaWarehouse,
  "transportation": TbTruckDelivery,
  "distribution": FaIndustry,
  "postgresql": SiPostgresql,
  "mysql": SiMysql,
  "javascript": SiJavascript,
  "html": SiHtml5,
  "css": SiCss3,
  "excel": FaFileExcel,
  "word": FaFileWord,
  "powerpoint": FaFilePowerpoint,
  "canva": SiCanva,
  "capcut": FaVideo,
  "tableau": SiTableau,
  "power bi": FaChartBar,
  "powerbi": FaChartBar,
  "databricks": SiDatabricks,
  "spark": SiApachespark
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

// Helper to ensure URL has proper protocol
function ensureUrlProtocol(url: string): string {
  if (!url) return url;
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
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
      <section id="skills" className="py-10 bg-gradient-to-b from-amber-50/50 to-transparent" style={{ cursor: 'auto' }}>
        <style>{`
          #skills * { cursor: auto; }
          #skills button { cursor: pointer; }
        `}</style>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 gap-2">
            <div className="flex items-center gap-2 min-[480px]:gap-3 min-w-0">
              <div className="p-1.5 min-[480px]:p-2 bg-amber-400 border-2 border-stone-900 rounded-sm shrink-0">
                <Target className="h-5 min-[480px]:h-6 w-5 min-[480px]:w-6 text-stone-900" />
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl min-[480px]:text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space)] truncate">Skills & Tools</h2>
                <p className="text-xs text-muted-foreground font-medium font-[family-name:var(--font-space)] truncate">Tech & expertise</p>
              </div>
            </div>
            
            {/* Show Details Button */}
            <Button
              onClick={() => setShowDetails(true)}
              aria-label="Filter skills"
              className="border-2 border-stone-900 rounded-md shrink-0"
              style={{
                background: '#c0c0c0',
                borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
                padding: '6px 12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline font-bold text-xs">Show Details</span>
            </Button>
          </div>

          <div className="grid gap-3 lg:grid-cols-5">
            {/* Skills List - NES Card */}
            <Card className="px-3 md:px-4 lg:col-span-2 bg-fuchsia-50 border-2 border-stone-900 overflow-hidden rounded-md" style={{
              border: '4px solid #000',
              boxShadow: 'inset -4px -4px 0px #808080, inset 4px 4px 0px #dfdfdf'
            }}>
              <CardContent className="px-0 py-0 min-[480px]:p-0">
                <div className="flex items-center gap-2 mb-4 p-2 min-[480px]:p-4" style={{ borderBottom: '2px solid #000' }}>
                  <div className="p-1 bg-fuchsia-400 border-2 border-stone-900 rounded-sm">
                    <Brain className="h-5 w-5 text-stone-900" />
                  </div>
                  <h3 className="font-black text-base min-[480px]:text-lg tracking-tight font-[family-name:var(--font-space)]" style={{ fontFamily: "'Courier New', monospace" }}>$ What I Can Do</h3>
                </div>
                <div className="space-y-2 min-[480px]:space-y-2.5  min-[480px]:px-0 pb-2 min-[480px]:pb-3">
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
                          className="group relative flex items-center gap-2 px-2 py-3 min-[480px]:p-3.5 bg-white border-2 border-stone-900 hover:border-fuchsia-400 transition-all duration-100 cursor-pointer overflow-hidden rounded-sm"
                          style={{
                            border: '2px solid #000',
                            boxShadow: 'inset -2px -2px 0px #808080, inset 2px 2px 0px #dfdfdf',
                            cursor: 'pointer'
                          }}
                        >
                          {/* Cyberpunk scanline effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-fuchsia-400/20" />
                          </div>
                          <div className={`relative z-10 p-1.5 ${bgColor} border-2 border-stone-900 rounded-sm shrink-0`}>
                            <SkillIcon className="h-5 w-5 text-white" />
                          </div>
                          <span className="relative z-10 text-base min-[480px]:text-lg font-bold flex-1 text-stone-800 font-[family-name:var(--font-space)]">{skill.name}</span>
                          {skill.has_certificates && (
                            <span className="relative z-10 flex items-center gap-0.5 text-xs font-bold bg-amber-400 text-stone-900 px-1.5 py-0.5 border-2 border-stone-900 shrink-0 rounded-sm">
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

            {/* Tools Bento Grid - NES Card */}
            <Card className="lg:col-span-3 bg-stone-50 border-2 border-stone-900 overflow-hidden rounded-md" style={{
              border: '4px solid #000',
              boxShadow: 'inset -4px -4px 0px #808080, inset 4px 4px 0px #dfdfdf'
            }}>
              <CardContent className="p-0 min-[480px]:p-1">
                <div className="flex items-center gap-2 mb-4 min-[480px]:mb-4 p-2 min-[480px]:p-3" style={{ borderBottom: '2px solid #000' }}>
                  <div className="p-1.5 bg-lime-400 border-2 border-stone-900 rounded-sm shrink-0">
                    <Code className="h-5 min-[480px]:h-6 w-5 min-[480px]:w-6 text-stone-900" />
                  </div>
                  <h3 className="font-black text-lg min-[480px]:text-lg tracking-tight font-[family-name:var(--font-space)]" style={{ fontFamily: "'Courier New', monospace" }}>$ Tools</h3>
                  <span className="ml-auto text-xs font-bold text-stone-900 bg-lime-300 px-2 py-1 border-2 border-stone-900 rounded-sm">{displayTools.length}</span>
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
                        const ToolIcon = getToolIcon(tool.name);
                      
                      const gridSize = tool.grid_size || "1x1";
                      const sizeClass = gridSize === "2x2" ? "lg" : gridSize === "2x1" ? "md" : "sm";
                      // Define colorful Bento grid palette
                      const colorPalette = [
                        "bg-yellow-600", "bg-green-700", "bg-blue-700", "bg-red-700",
                        "bg-violet-700", "bg-pink-700", "bg-orange-700", "bg-cyan-700",
                        "bg-emerald-700", "bg-rose-700", "bg-amber-700", "bg-teal-700",
                        "bg-indigo-700"
                      ];
                      // Assign color based on index for variety
                      const toolBg = colorPalette[displayTools.indexOf(tool) % colorPalette.length];
                      const toolColor = ["bg-yellow-600", "bg-amber-700"].includes(toolBg) ? "text-stone-950" : "text-white";
                      
                      return (
                        <div
                          key={tool.id}
                          className={`group relative flex flex-col items-center justify-center ${toolBg} border-2 border-stone-900 cursor-pointer overflow-hidden rounded-sm
                            ${sizeClass === "lg" ? "col-span-2 row-span-2 p-4" : ""}
                            ${sizeClass === "md" ? "col-span-2 p-2.5" : ""}
                            ${sizeClass === "sm" ? "col-span-1 p-2.5" : ""}
                          `}
                          style={{
                            border: '3px solid #000',
                            boxShadow: 'inset -3px -3px 0px rgba(0,0,0,0.3), inset 3px 3px 0px rgba(255,255,255,0.5)',
                            cursor: 'pointer'
                          }}
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 md:p-6" onClick={() => setShowDetails(false)}>
          <div 
            className="bg-white border-2 border-stone-900 w-full max-w-full sm:max-w-md md:max-w-xl max-h-[90vh] overflow-y-auto rounded-md"
            onClick={(e) => e.stopPropagation()}
            style={{
              border: '4px solid #000',
              boxShadow: 'inset -4px -4px 0px #808080, inset 4px 4px 0px #dfdfdf'
            }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-fuchsia-300 p-4 border-b-2 border-stone-900 flex items-center justify-between" style={{ borderBottom: '4px solid #000' }}>
              <h3 className="text-lg font-black text-stone-900 font-[family-name:var(--font-space)]" style={{ fontFamily: "'Courier New', monospace" }}>
                $ {selectedSkill ? selectedSkill.name : "All Skills & Certifications"}
              </h3>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedSkill(null);
                }}
                aria-label="Close skills details"
                className="p-1 bg-white border-2 border-stone-900"
                style={{
                  border: '2px solid #000',
                  boxShadow: 'inset -2px -2px 0px #808080, inset 2px 2px 0px #dfdfdf',
                  cursor: 'pointer'
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 md:p-6">
              {selectedSkill ? (
                // Single Skill View with Multiple Certificates
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const SkillIcon = getSkillIcon(selectedSkill.name);
                      const bgColor = selectedSkill.bg_color ? `bg-${selectedSkill.bg_color}` : "bg-emerald-500";
                      return (
                        <div className={`p-2 ${bgColor} border-2 border-stone-900`} style={{
                          border: '3px solid #000',
                          boxShadow: 'inset -2px -2px 0px rgba(0,0,0,0.3), inset 2px 2px 0px rgba(255,255,255,0.5)'
                        }}>
                          <SkillIcon className="h-6 w-6 text-white" />
                        </div>
                      );
                    })()}
                    <div>
                      <h4 className="font-black text-lg font-[family-name:var(--font-space)]" style={{ fontFamily: "'Courier New', monospace" }}>$ {selectedSkill.name}</h4>
                      {selectedSkill.has_certificates && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Certified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 1. $ Skills */}
                  {selectedSkill.sub_skills && selectedSkill.sub_skills.length > 0 && (
                    <div>
                      <h5 className="text-sm font-bold mb-2 text-muted-foreground flex items-center gap-2" style={{ fontFamily: "'Courier New', monospace" }}>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        $ Skills
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
                      <h5 className="text-sm font-bold mb-2 text-muted-foreground flex items-center gap-2" style={{ fontFamily: "'Courier New', monospace" }}>
                        <Award className="h-4 w-4 text-amber-500" />
                        $ Certificates ({selectedSkill.certificates.length})
                      </h5>
                      <div className="space-y-3">
                        {selectedSkill.certificates.map((cert, idx) => (
                          <div key={cert.id} className="relative bg-gradient-to-br from-amber-100 to-purple-100 border-2 border-stone-900  p-3 w-full">
                            
                            {/* Certificate Title - Center */}
                            <h6 className="text-center text-base sm:text-lg md:text-xl font-bold text-stone-900 font-[family-name:var(--font-space-mono)] mb-1 tracking-tight">
                              {cert.title}
                            </h6>

                            {/* Provider */}
                            {cert.issuer && (
                              <p className="text-left text-xs text-stone-600 font-medium mb-2">
                                By {cert.issuer}
                              </p>
                            )}

                            {/* Certificate Image */}
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
                              <div className="flex items-center gap-2" style={{ fontFamily: "'Courier New', monospace" }}>
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
                                  href={ensureUrlProtocol(cert.credential_url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 px-2 py-1 bg-amber-400 text-stone-900 text-[10px] font-black border border-stone-900"
                                  style={{
                                    borderRadius: '6%',
                                    border: '2px solid #000',
                                    boxShadow: 'inset -2px -2px 0px rgba(0,0,0,0.3), inset 2px 2px 0px rgba(255,255,255,0.5)',
                                    cursor: 'pointer'
                                  }}
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
                      <h5 className="text-sm font-bold mb-2 text-muted-foreground flex items-center gap-2" style={{ fontFamily: "'Courier New', monospace" }}>
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
                    className="w-full border-2 border-stone-900"
                    style={{
                      border: '3px solid #000',
                      boxShadow: 'inset -3px -3px 0px #808080, inset 3px 3px 0px #dfdfdf',
                      cursor: 'pointer'
                    }}
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
                          className={`group flex items-center gap-3 p-3 min-[480px]:p-4 border-2 border-stone-900 cursor-pointer rounded-sm ${bgColor}/10`}
                          style={{
                            border: '2px solid #000',
                            boxShadow: 'inset -2px -2px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.4)',
                            cursor: 'pointer'
                          }}
                        >
                          <div className={`p-2 min-[480px]:p-2.5 ${bgColor} border-2 border-stone-900 rounded-sm shrink-0`}>
                            <SkillIcon className="h-5 w-5 min-[480px]:h-6 min-[480px]:w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base min-[480px]:text-lg font-[family-name:var(--font-space)]">{skill.name}</h4>
                            <p className="text-xs min-[480px]:text-sm text-muted-foreground">
                              {(skill.sub_skills || []).slice(0, 3).join(" • ")}
                            </p>
                          </div>
                          {skill.has_certificates && skill.certificates && skill.certificates.length > 0 && (
                            <span className="text-[10px] font-bold bg-amber-400 text-stone-900 px-2 py-1 border-2 border-stone-900 rounded-sm shrink-0">
                              <Award className="h-3 w-3 inline mr-1" />
                              {skill.certificates.length} CERT
                            </span>
                          )}
                          <ChevronRight className="h-5 w-5 text-stone-400 group-hover:text-stone-900 shrink-0" />
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
