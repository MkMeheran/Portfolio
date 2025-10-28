"use client";
import data from "@/data/content.json";
import theme from "@/data/theme.json";
import {
  FaProjectDiagram,
  FaTags,
  FaCalendarAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

type Props = {
  projects: typeof data.projects;
  theme: typeof theme;
};

export default function Projects({ projects, theme }: Props) {
  return (
    <section id="projects" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Title */}
        <h2
          className="text-3xl md:text-4xl font-extrabold font-cyber 
                     bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 
                     bg-clip-text text-transparent tracking-wide flex items-center gap-3"
        >
          <FaProjectDiagram className="text-emerald-400 min-w-[28px] min-h-[28px]" />
          Featured Projects
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg 
                         border border-emerald-500/20 hover:shadow-emerald-400/30 
                         transition-transform duration-300 hover:scale-[1.02] p-6 flex flex-col space-y-4"
            >
              {/* Title */}
              <h3 className="text-xl font-bold text-white text-center">
                {p.title}
              </h3>

              {/* Image */}
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/${p.image}`}
                  alt={p.title}
                  className="w-full aspect-[16/9] object-cover rounded-md border border-emerald-500/30"
                />
              )}

              {/* Tags */}
              {p.tags && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-400">
                  <FaTags className="text-emerald-400 min-w-[18px] min-h-[18px] shrink-0" />
                  {p.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Summary with slim scrollbar */}
              {p.summary && (
                <div
                  className="max-h-32 overflow-y-auto pr-4 "

                >
                  {p.summary}
                </div>
              )}

              {/* Footer: Date + Link */}
              <div className="flex items-center justify-between mt-auto">
                {p.date && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FaCalendarAlt className="text-cyan-400 min-w-[16px] min-h-[16px]" />
                    {p.date}
                  </div>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold 
                               text-sky-300 hover:text-sky-400 transition-colors"
                  >
                    Visit{" "}
                    <FaExternalLinkAlt className="text-sky-400 min-w-[14px] min-h-[14px]" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}