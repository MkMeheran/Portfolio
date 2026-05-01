"use client";

import dynamic from "next/dynamic";

const SkillsSection = dynamic(
  () => import("@/components/sections/skills-section").then((mod) => mod.SkillsSection),
  { ssr: false }
);

export function LazySkillsSection() {
  return <SkillsSection />;
}
