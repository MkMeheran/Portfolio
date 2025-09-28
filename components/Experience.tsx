"use client";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import data from "@/data/content.json";
import theme from "@/data/theme.json"; 

type Props = {
  experience: typeof data.experience;
   theme: typeof theme; // ✅ theme prop add করা হলো
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
    <section id="experience" className="py-16 bg-[var(--surface2)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Experience</h2>
        </div>

        {/* Grid layout same as Education */}
        <div className="grid md:grid-cols-1 gap-4 mt-6">
          {experience.map((exp, i) => (
            <div key={i} className="bg-[#0ef] rounded-sm shadow-custom p-4">
              {/* Role & Org */}
              <strong className="text-[#000000]">
                {exp.role} _ {exp.org}
              </strong>

              {/* Dates */}
              <div className="text-sm text-[#000000] border-l-2 border-black pl-1">
                {fmt(exp.start)} – {fmt(exp.end) || "Present"}
              </div>

              {/* Description */}
              {exp.description && (
                <div className="text-sm text-[#000000] border-black pl-1 mt-1 overflow-x-auto prose max-w-none">
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm]}
                  >
                    {exp.description}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
