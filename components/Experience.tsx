"use client";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import data from "@/data/content.json";
import theme from "@/data/theme.json";
import { FaBriefcase, FaBuilding, FaCalendarAlt, FaTasks } from "react-icons/fa";

type Props = {
  experience: typeof data.experience;
  theme: typeof theme;
};

export default function Experience({ experience }: Props) {
  const fmt = (s?: string | null) => {
    if (!s) return "";
    if (s.toLowerCase() === "present") return "Present";
    const [y, m] = s.split("-");
    const dt = new Date(Number(y), m ? Number(m) - 1 : 0, 1);
    return dt.toLocaleString(undefined, { month: "short", year: "numeric" });
  };

  return (
    <section id="experience" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Title */}
        <h2
          className="text-3xl md:text-4xl font-extrabold font-cyber 
                     bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 
                     bg-clip-text text-transparent tracking-wide flex items-center gap-3"
        >
          <FaBriefcase className="text-emerald-400 min-w-[28px] min-h-[28px]" />
          Experience
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {experience.map((exp, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg 
                         border border-emerald-500/20 hover:shadow-emerald-400/30 
                         transition-transform duration-300 hover:scale-[1.02] p-6 flex flex-col"
            >
              {/* Role */}
              <div className="flex items-center gap-3">
                <FaBriefcase className="text-sky-400 min-w-[22px] min-h-[22px] shrink-0" />
                <h3 className="text-xl font-bold text-white">{exp.role}</h3>
              </div>

              {/* Organization */}
              <div className="flex items-center gap-3 text-base text-emerald-400 font-medium mt-2">
                <FaBuilding className="text-emerald-400 min-w-[20px] min-h-[20px] shrink-0" />
                {exp.org}
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-3 text-sm text-gray-300 mt-2">
                <FaCalendarAlt className="text-cyan-400 min-w-[18px] min-h-[18px] shrink-0" />
                {fmt(exp.start)} – {fmt(exp.end) || "Present"}
              </div>

              {/* Description with scroll */}
              {exp.description && (
                <div className="flex items-start gap-3 text-sm text-gray-300 mt-3 flex-1">
                  <FaTasks className="text-amber-400 min-w-[18px] min-h-[18px] shrink-0 mt-1" />
                  <div
                    className="prose prose-invert max-w-none text-gray-300 
                               max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-transparent"
                  >
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {exp.description}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}