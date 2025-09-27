"use client";
import data from "@/data/content.json";

type Props = {
  education: typeof data.education;
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
    <section id="education" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Education</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {education.map((e, i) => (
            <div key={i} className="bg-[#0ef] rounded-sm shadow-custom p-4">
              <strong className="text-[#000000]">
                {e.program} _ {e.org}
              </strong>
              <div className="text-sm text-[#000000] border-l-2 border-black pl-1">
                {fmt(e.start)} – {fmt(e.end)}
              </div>
              {e.result && (
                <div className="text-sm border-l-2 border-black text-[#000000] pl-1">
                  Result: {e.result}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
