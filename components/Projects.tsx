"use client";
import data from "@/data/content.json";
import theme from "@/data/theme.json";

type Props = {
  projects: typeof data.projects;
  theme: typeof theme;
};

export default function Projects({ projects, theme }: Props) {
  return (
    <section id="projects" className="py-16">
      <div className="max-w-[1110px] mx-auto ">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Projects
        </h2>

        {/* Responsive scrollable container */}
        <div className="overflow-x-auto scrollbar-thin pl-4 pb-4">
          <div className="flex gap-6 flex-nowrap justify-left">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0 w-[85%] sm:w-[48%] md:w-[45%] max-w-[320px] aspect-[11/14] bg-[#0ef] text-black border-4 border-black rounded-sm overflow-hidden"
              >
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/${p.image}`}
                    alt={p.title}
                    className="w-full aspect-[16/9] object-cover border-b-2 border-black"
                  />
                )}

                <h3 className="font-bold text-lg text-center py-1 bg-[#0ef] text-black">
                  {p.title}
                </h3>

                {/* Tags */}
                {p.tags && (
                  <div className="ml-[2%]">
                    {p.tags.map((t, i) => (
                      <span
                        key={i}
                        className="inline-block px-2 py-0.5 text-sm border border-black bg-[#0ef] text-black max-w-[100px] truncate mr-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Summary */}
                <p className="line-clamp-5 text-sm leading-relaxed mt-2 ml-[2%] pl-2 text-left border-l border-black bg-[var(--color001)] text-black">
                  {p.summary}
                </p>

                {/* Buttons / Date */}
                <div className="flex flex-wrap items-center gap-2 mt-2 ml-[2%] mb-3">
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center font-bold text-sm px-3 py-1 border border-black bg-[var(--color001)] text-black hover:scale-110 transition-transform"
                    >
                      Visit
                    </a>
                  )}
                  {p.date && (
                    <span className="inline-flex items-center font-bold text-sm px-3 py-1 border border-black bg-[var(--color001)] text-black">
                      {p.date}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
