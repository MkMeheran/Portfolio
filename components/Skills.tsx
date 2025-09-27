"use client";
import data from "@/data/content.json";
import theme from "@/data/theme.json";

type Props = {
  skills: typeof data.skills;
  theme: typeof theme;
};

export default function Skills({ skills, theme }: Props) {
  return (
    <section id="skills" className="py-16 bg-[var(--surface2)]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold" style={{ color: theme.colors.accent }}>
          Skills & Tools
        </h2>
        <p className="text-muted">Core stack I use to ship fast and reliably.</p>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {skills.map((s) => {
            const pct = Math.max(0, Math.min(100, s.level || 0));
            return (
              <div
                key={s.id}
                className="bg-[#0ef] rounded-sm shadow-custom p-4"
              >
                {/* Name + Status */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-black">
                    {s.icon ? `${s.icon} ` : ""}
                    {s.name}
                  </h3>
                  {s.status && (
                    <span className="font-bold px-2 py-1 rounded-sm bg-slate-500 text-[#0ef]">
                      {s.status}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-2 bg-slate-500 rounded-sm overflow-hidden">
                    <div
                      className="h-2 bg-slate-800 transition-[width] duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Summary */}
                {s.summary && (
                  <div className="text-sm text-black mt-2 p-2 border-l-2 border-b-2 rounded-sm border-slate-800">
                    {s.summary}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
