"use client";
import data from "@/data/content.json";
import theme from "@/data/theme.json";
import {
  FaPython,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaTools,
  FaCheckCircle,
} from "react-icons/fa";
import {
  SiQgis,
  SiAdobephotoshop,
  SiAdobeillustrator,
} from "react-icons/si";
import { MdMap } from "react-icons/md";
import { TbMap2 } from "react-icons/tb";
import { MdOutlinePendingActions } from "react-icons/md";
import { GiNetworkBars } from "react-icons/gi"; // Programming
import { MdOutlineDesignServices } from "react-icons/md"; // Design
import { MdOutlineWorkspaces } from "react-icons/md"; // Office
import { MdCategory } from "react-icons/md"; // Other / fallback

type Props = {
  skills: typeof data.skills;
  theme: typeof theme;
};

// Skill icon map
const skillIconMap: Record<string, React.ReactNode> = {
  arcgis: <MdMap className="text-emerald-400 text-xl" />,
  qgis: <SiQgis className="text-lime-400 text-xl" />,
  leaflet: <TbMap2 className="text-emerald-400 text-xl" />,
  python: <FaPython className="text-yellow-400 text-xl" />,
  word: <FaFileWord className="text-sky-500 text-xl" />,
  excel: <FaFileExcel className="text-green-500 text-xl" />,
  powerpoint: <FaFilePowerpoint className="text-orange-500 text-xl" />,
  photoshop: <SiAdobephotoshop className="text-sky-400 text-xl" />,
  illustrator: <SiAdobeillustrator className="text-amber-400 text-xl" />,
};

// Category icon + accent color map (adds subtle variation per category)
const categoryMeta: Record<
  string,
  { icon: React.ReactNode; titleColor: string; borderColor: string; barFrom: string; barTo: string }
> = {
  "GIS Tools": {
    icon: <MdMap className="text-emerald-400 text-2xl" />,
    titleColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    barFrom: "from-emerald-400",
    barTo: "to-cyan-300",
  },
  Programming: {
    icon: <GiNetworkBars className="text-yellow-400 text-2xl" />,
    titleColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    barFrom: "from-yellow-400",
    barTo: "to-sky-400",
  },
  "Design Tools": {
    icon: <MdOutlineDesignServices className="text-pink-400 text-2xl" />,
    titleColor: "text-pink-400",
    borderColor: "border-pink-500/30",
    barFrom: "from-pink-400",
    barTo: "to-sky-400",
  },
  "Office Tools": {
    icon: <MdOutlineWorkspaces className="text-sky-400 text-2xl" />,
    titleColor: "text-sky-400",
    borderColor: "border-sky-500/30",
    barFrom: "from-sky-400",
    barTo: "to-blue-500",
  },
  Other: {
    icon: <MdCategory className="text-gray-400 text-2xl" />,
    titleColor: "text-gray-300",
    borderColor: "border-gray-500/30",
    barFrom: "from-gray-400",
    barTo: "to-emerald-400",
  },
};

export default function Skills({ skills, theme }: Props) {
  // Group skills by category (default "Other" if missing)
  const grouped = skills.reduce((acc: Record<string, typeof skills>, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-14 bg-[#000319] text-[var(--text)]">
      <div className="max-w-6xl mx-auto px-3">
        {/* Title (compact spacing + portfolio font) */}
        <h2
          className="font-extrabold font-cyber text-3xl md:text-4xl
                     bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300
                     bg-clip-text text-transparent tracking-wide"
        >
          Skills & Tools
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          Core stack across mapping, design, analysis, and presentation.
        </p>

        {/* Category cards grid: 1 col on small, max 3 on large */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(grouped).map(([category, items]) => {
            const meta =
              categoryMeta[category] ??
              categoryMeta["Other"];

            return (
              <div
                key={category}
                className="bg-white/5 backdrop-blur-md rounded-lg shadow
                           border border-white/10 p-4"
              >
                {/* Category header: icon + title, compact */}
                <div className="flex items-center gap-2 border-b pb-2 mb-3 
                                font-display text-lg font-semibold
                                bg-gradient-to-r from-white/0 to-white/0">
                  <span>{meta.icon}</span>
                  <span className={`${meta.titleColor}`}>{category}</span>
                </div>

                {/* Skills list with y-axis scrollbar when > 3 items */}
                <div
                  className={`space-y-3 pr-2 ${
                    items.length > 3 ? "max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-transparent" : ""
                  }`}
                >
                  {items.map((s) => {
                    const pct = Math.max(0, Math.min(100, s.level || 0));

                    // Status icon only
                    let statusIcon: React.ReactNode = null;
                    const status = s.status?.toLowerCase();
                    if (status === "running") {
                      statusIcon = (
                        <MdOutlinePendingActions className="text-yellow-400 text-base" />
                      );
                    } else if (status === "complete") {
                      statusIcon = (
                        <FaCheckCircle className="text-emerald-400 text-base" />
                      );
                    }

                    return (
                      <div
                        key={s.id}
                        className="group bg-white/5 rounded-md border border-white/10 p-3"
                      >
                        {/* Compact row */}
                        <div className="flex items-center gap-2">
                          {skillIconMap[s.icon] ?? (
                            <FaTools className="text-gray-400 text-base" />
                          )}
                          <h4 className="text-sm font-semibold text-white">
                            {s.name}
                          </h4>
                          {statusIcon && (
                            <span
                              className="ml-auto p-1 rounded-full bg-white/10 border border-white/20"
                              title={s.status}
                            >
                              {statusIcon}
                            </span>
                          )}
                        </div>

                        {/* Details on hover (no animations) */}
                        <div className="hidden group-hover:block mt-2">
                          <div className="h-1.5 bg-gray-700/60 rounded-full overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full bg-gradient-to-r ${meta.barFrom} ${meta.barTo}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {pct}% proficiency
                          </p>

                          {s.summary && (
                            <div className="text-xs text-gray-300 mt-2 p-2 border-l
                                            border-white/20 bg-white/5 rounded">
                              {s.summary}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}