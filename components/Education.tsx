"use client";
import data from "@/data/content.json";
import theme from "@/data/theme.json";
import {
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaAward,
} from "react-icons/fa";

type Props = {
  education: typeof data.education;
  theme: typeof theme;
};

export default function Education({ education }: Props) {
  const fmt = (s?: string) => {
    if (!s) return "";
    if (s.toLowerCase() === "present") return "Present";
    const [y, m] = s.split("-");
    const dt = new Date(Number(y), m ? Number(m) - 1 : 0, 1);
    return dt.toLocaleString(undefined, { month: "short", year: "numeric" });
  };

  return (
    <section id="education" className="py-14 bg-[#000319] text-[var(--text)]">
      <div className="max-w-6xl mx-auto px-3">
        {/* Section Title */}
        <h2
          className="text-3xl md:text-4xl font-extrabold font-cyber 
                     bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 
                     bg-clip-text text-transparent tracking-wide flex items-center gap-3"
        >
          <FaGraduationCap className="text-emerald-400 min-w-[28px] min-h-[28px]" />
          Education
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {education.map((e, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md rounded-lg shadow 
                         border border-white/10 hover:border-emerald-400/40 
                         hover:shadow-emerald-400/20 p-5 space-y-2"
            >
              {/* Program */}
              <div className="flex items-center gap-2">
                <FaGraduationCap className="text-sky-400 min-w-[20px] min-h-[20px]" />
                <h3 className="text-lg font-bold text-white">{e.program}</h3>
              </div>

              {/* Institute */}
              <div className="flex items-center gap-2 text-sm text-emerald-300 font-medium">
                <FaUniversity className="text-emerald-400 min-w-[18px] min-h-[18px]" />
                {e.org}
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <FaCalendarAlt className="text-cyan-400 min-w-[16px] min-h-[16px]" />
                {fmt(e.start)} – {fmt(e.end)}
              </div>

              {/* Result */}
              {e.result && (
                <div className="flex items-center gap-2 text-sm text-sky-300 font-semibold mt-1">
                  <FaAward className="text-amber-400 min-w-[16px] min-h-[16px]" />
                  {e.result}
                </div>
              )}

             
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}