"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Target, 
  Brain, 
  Award, 
  Eye, 
  X, 
  ChevronRight, 
  CheckCircle2,
  Filter,
  Sparkles,
  Wrench,
  Zap,
  TrendingUp,
  Star,
  Layers,
  GraduationCap,
  Code2,
  ExternalLink,
  Loader2,
  Calendar
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Skill, Certificate, Tool } from "@/types/database.types";

// react-icons imports
import { SiQgis, SiPython, SiJavascript, SiHtml5, SiCss3, SiCanva, SiReact, SiTypescript, SiTailwindcss, SiNextdotjs, SiPostgresql, SiMysql, SiTableau, SiDatabricks, SiApachespark } from "react-icons/si";
import { FaDatabase, FaVideo, FaMapMarkedAlt, FaFileWord, FaFileExcel, FaFilePowerpoint, FaGlobe, FaCode, FaPaintBrush, FaChartBar, FaNodeJs, FaCog, FaTruck, FaWarehouse, FaShippingFast, FaIndustry, FaMapMarked, FaChartLine, FaBrain, FaRobot } from "react-icons/fa";
import { BiMoviePlay, BiData } from "react-icons/bi";
import { TbTruckDelivery, TbMapSearch } from "react-icons/tb";
import { MdAnalytics, MdScience } from "react-icons/md";

// Icon mapping
const skillIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "geospatial": FaGlobe,
  "gis": FaMapMarked,
  "mapping": TbMapSearch,
  "spatial": FaMapMarkedAlt,
  "sql": FaDatabase,
  "database": FaDatabase,
  "python": SiPython,
  "web": FaCode,
  "excel": FaChartBar,
  "video": BiMoviePlay,
  "design": FaPaintBrush,
  "supply chain": FaTruck,
  "logistics": FaShippingFast,
  "warehouse": FaWarehouse,
  "transportation": TbTruckDelivery,
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
  "react": SiReact,
  "typescript": SiTypescript,
  "tailwind": SiTailwindcss,
  "next": SiNextdotjs,
  "node": FaNodeJs,
  "tableau": SiTableau,
  "power bi": FaChartBar,
  "powerbi": FaChartBar,
  "databricks": SiDatabricks,
  "spark": SiApachesparkon,
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
  "react": SiReact,
  "typescript": SiTypescript,
  "tailwind": SiTailwindcss,
  "next": SiNextdotjs,
  "node": FaNodeJs,
  "default": FaCog,
};

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

interface SkillWithCertificates extends Skill {
  certificates?: Certificate[];
}

type Category = "all" | "certified" | "learning";

// Animated counter
function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count}</span>;
}

// Animated Progress Bar
function ProgressBar({ level, color, delay = 0 }: { level: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(level);
    }, delay);
    return () => clearTimeout(timer);
  }, [level, delay]);
  
  return (
    <div className="h-2.5 bg-stone-200 border border-stone-300 overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// Skill Card with Modal
function SkillCard({ skill, index }: { skill: SkillWithCertificates; index: number }) {
  const [showModal, setShowModal] = useState(false);
  const Icon = getSkillIcon(skill.name);
  const bgColor = skill.bg_color ? `bg-${skill.bg_color}` : "bg-emerald-500";
  const gradient = skill.bg_color?.includes("emerald") ? "from-emerald-400 to-teal-500"
    : skill.bg_color?.includes("orange") ? "from-orange-400 to-red-500"
    : skill.bg_color?.includes("yellow") ? "from-yellow-400 to-amber-500"
    : skill.bg_color?.includes("violet") ? "from-violet-400 to-purple-500"
    : skill.bg_color?.includes("blue") ? "from-blue-400 to-indigo-500"
    : skill.bg_color?.includes("pink") ? "from-pink-400 to-rose-500"
    : skill.bg_color?.includes("rose") ? "from-rose-400 to-pink-500"
    : "from-emerald-400 to-teal-500";
  const subSkills = skill.sub_skills || [];
  const level = 85; // Default, can be added to DB later
  
  return (
    <>
      <div 
        className="group relative bg-white border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] hover:shadow-[6px_6px_0px_0px_#1c1917] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 overflow-hidden"
      >
        {/* Gradient Header */}
        <div className={`relative bg-gradient-to-r ${gradient} p-4 sm:p-5 border-b-2 border-stone-900`}>
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 border-2 border-white/30 backdrop-blur-sm">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-white text-base sm:text-lg">
                  {skill.name}
                </h3>
                <p className="text-white/80 text-xs">{subSkills.length} capabilities</p>
              </div>
            </div>
            {skill.has_certificates && (
              <div className="bg-amber-400 px-2 py-1 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3 text-stone-900" />
                  <span className="text-[10px] font-bold text-stone-900 uppercase hidden sm:inline">Certified</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Skill Level - hidden per request
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-stone-600">Proficiency</span>
              <span className="font-black text-stone-900">{skill.level}%</span>
            </div>
            <ProgressBar level={level} color={bgColor} delay={index * 100} />
          </div>
          */}
          
          {/* Sub-skills Preview */}
          <div className="flex flex-wrap gap-1 mb-3">
            {subSkills.slice(0, 3).map((sub) => (
              <span 
                key={sub} 
                className="px-1.5 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-medium border border-stone-200"
              >
                {sub}
              </span>
            ))}
            {subSkills.length > 3 && (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium border border-amber-200">
                +{subSkills.length - 3}
              </span>
            )}
          </div>

          {/* View Details Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-stone-900 text-white font-bold text-sm border-2 border-stone-900 shadow-[2px_2px_0px_0px_#fbbf24] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 flex items-center justify-center gap-1.5 py-2"
          >
            <Eye className="h-3.5 w-3.5" />
            View Details
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-900/90 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div 
            className="bg-white border-2 border-stone-900 shadow-[8px_8px_0px_0px_#fbbf24] w-full max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-200"
            style={{
              maxWidth: 'min(700px, 90vw)',
            }}
          >
            {/* Modal Header */}
            <div className={`relative bg-gradient-to-r ${gradient} p-5 border-b-2 border-stone-900`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.3'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 border-2 border-white/30">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl">{skill.name}</h3>
                    <p className="text-white/80 text-sm">{skill.has_certificates ? 'Certified' : 'Learning'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 transition-colors border border-white/30"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Progress - hidden per request
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-stone-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Proficiency Level
                  </span>
                  <span className="font-black text-stone-900 text-lg">{level}%</span>
                </div>
                <div className="h-4 bg-stone-200 border-2 border-stone-300 overflow-hidden">
                  <div 
                    className={`h-full ${bgColor} transition-all duration-500`}
                    style={{ width: `${level}%` }}
                  />
                </div>
              </div>
              */}

              {/* 1. Skills Included (sub_skills) */}
              {subSkills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Skills Included
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {subSkills.map((sub, i) => (
                      <span
                        key={sub}
                        className={`px-3 py-1.5 ${bgColor} text-white text-sm font-bold border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]`}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Certificates */}
              {skill.has_certificates && skill.certificates && skill.certificates.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <GraduationCap className="h-4 w-4 text-amber-500" />
                    Certificates ({skill.certificates.length})
                  </h4>
                  <div className="space-y-3">
                    {skill.certificates.map((cert, idx) => (
                      <div key={cert.id} className="relative bg-gradient-to-br from-amber-100 to-purple-100 border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] p-3">
                        
                        {/* Certificate Title - Center */}
                        <h6 className="text-center text-xl md:text-2xl font-bold text-stone-900 font-[family-name:var(--font-space-mono)] mb-1 tracking-tight">
                          {cert.title}
                        </h6>

                        {/* Provider */}
                        {cert.issuer && (
                          <p className="text-center text-xs text-stone-600 font-medium mb-2">
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

                        {/* Divider between certificates */}
                        {idx < skill.certificates!.length - 1 && (
                          <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t-2 border-dashed border-stone-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <span className="bg-white px-3 text-xs text-stone-400 font-bold">●</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Capabilities (same as sub-skills but different display) */}
              {subSkills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Zap className="h-4 w-4 text-violet-500" />
                    Capabilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {subSkills.map((sub, i) => (
                      <div 
                        key={sub} 
                        className="px-3 py-2.5 bg-stone-50 border-2 border-stone-200 text-stone-700 text-sm font-medium flex items-center gap-2 hover:border-stone-400 transition-colors"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <ChevronRight className="h-4 w-4 text-amber-500" />
                        {sub}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Tool Badge
function ToolBadge({ tool }: { tool: Tool }) {
  const Icon = getToolIcon(tool.name);
  const toolBg = tool.category === "programming" ? "bg-yellow-400" 
    : tool.category === "gis" ? "bg-green-500"
    : tool.category === "office" ? "bg-blue-500"
    : tool.category === "design" ? "bg-violet-500"
    : "bg-stone-500";
  const textColor = ["bg-yellow-400"].includes(toolBg) ? "text-stone-900" : "text-white";
  
  return (
    <div className={`${toolBg} px-3 py-2 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 flex items-center gap-2 cursor-default`}>
      {tool.icon_url ? (
        <Image src={tool.icon_url} alt={tool.icon_alt || tool.name} width={20} height={20} />
      ) : (
        <Icon className={`h-5 w-5 ${textColor}`} />
      )}
      <span className={`font-bold text-sm ${textColor}`}>{tool.name}</span>
    </div>
  );
}

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [skills, setSkills] = useState<SkillWithCertificates[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setIsLoaded(true);
    
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
  
  const filteredSkills = activeCategory === "all" 
    ? skills 
    : activeCategory === "certified"
    ? skills.filter((s) => s.has_certificates)
    : skills.filter((s) => !s.has_certificates);

  const categories: { key: Category; label: string; icon: React.ElementType; count: number; color: string }[] = [
    { key: "all", label: "All", icon: Layers, count: skills.length, color: "bg-stone-200" },
    { key: "certified", label: "Certified", icon: Award, count: skills.filter(s => s.has_certificates).length, color: "bg-amber-400" },
    { key: "learning", label: "Learning", icon: Brain, count: skills.filter(s => !s.has_certificates).length, color: "bg-blue-400" },
  ];

  const totalSubSkills = skills.reduce((acc, s) => acc + (s.sub_skills?.length || 0), 0);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
          }} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-amber-400/20 rotate-12 border-2 border-amber-400/30 animate-pulse" />
          <div className="absolute top-32 right-16 w-14 h-14 bg-emerald-400/20 -rotate-12 border-2 border-emerald-400/30" />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-400/20 rotate-45 border-2 border-blue-400/30" />
          <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-pink-400/20 -rotate-6 border-2 border-pink-400/30 animate-pulse" />
        </div>
        
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-16 relative">
          <div className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-white text-violet-600 px-4 py-1.5 border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917] mb-6">
              <Code2 className="h-4 w-4" />
              <span className="text-sm font-black uppercase tracking-wider">Expertise</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
              Skills & Tools<span className="text-amber-400">.</span>
            </h1>
            
            <p className="text-violet-200 max-w-2xl text-base sm:text-lg mb-8">
              Technologies and expertise I bring to every project. From GIS analysis to modern web development, 
              here&apos;s my technical toolkit.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-400 border-2 border-stone-900 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-stone-900" />
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-400">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <AnimatedNumber value={skills.length} />}
                  </div>
                  <div className="text-xs text-violet-300 uppercase tracking-wide">Core Skills</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-400 border-2 border-stone-900 flex items-center justify-center">
                  <Award className="h-6 w-6 text-stone-900" />
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <AnimatedNumber value={skills.filter(s => s.has_certificates).length} />}
                  </div>
                  <div className="text-xs text-violet-300 uppercase tracking-wide">Certified</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-400 border-2 border-stone-900 flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-stone-900" />
                </div>
                <div>
                  <div className="text-2xl font-black text-pink-400">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <AnimatedNumber value={tools.length} />}
                  </div>
                  <div className="text-xs text-violet-300 uppercase tracking-wide">Tools</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-400 border-2 border-stone-900 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-stone-900" />
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-400">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <AnimatedNumber value={totalSubSkills} />}
                  </div>
                  <div className="text-xs text-violet-300 uppercase tracking-wide">Capabilities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#fafaf9"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`group flex items-center gap-2 px-5 py-2.5 font-bold text-sm border-2 border-stone-900 transition-all duration-200 ${
                  isActive 
                    ? 'bg-stone-900 text-white shadow-none translate-x-[3px] translate-y-[3px]' 
                    : 'bg-white text-stone-900 shadow-[3px_3px_0px_0px_#1c1917] hover:shadow-[1px_1px_0px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px]'
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-violet-400' : ''}`} />
                {cat.label}
                <span className={`text-xs px-2 py-0.5 transition-colors ${
                  isActive ? cat.color + ' text-stone-900' : 'bg-stone-100 text-stone-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </div>
        )}

        {/* Tools Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-400 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
              <Wrench className="h-6 w-6 text-stone-900" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">Tools & Technologies</h2>
              <p className="text-stone-500 text-sm sm:text-base">Software and frameworks I work with daily</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <ToolBadge key={tool.name} tool={tool} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 border-t-2 border-stone-900">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Want to see these skills in action?
              </h2>
              <p className="text-violet-200">
                Check out my projects or get in touch for collaboration.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://udyomxorg.vercel.app/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-violet-600 px-6 py-3 font-bold border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] hover:shadow-[2px_2px_0px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              >
                View Projects
              </a>
              <a
                href="/#contact"
                className="bg-amber-400 text-stone-900 px-6 py-3 font-bold border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] hover:shadow-[2px_2px_0px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
