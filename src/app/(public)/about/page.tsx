import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about my journey as an Urban Planner and Web Developer.",
};

export default function AboutPage() {
  return <AboutSection />;
}
