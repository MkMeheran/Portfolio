import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about-section";
import { seoConfig, getFAQStructuredData } from "@/config/seo.config";

export const metadata: Metadata = {
  title: "About",
  description: seoConfig.personal.longBio,
  keywords: [
    ...seoConfig.personal.aliases,
    "About " + seoConfig.personal.fullName,
    "Biography",
    "Career Goals",
    "Education Background",
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* FAQ Structured Data for Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFAQStructuredData()),
        }}
      />
      <AboutSection />
    </>
  );
}
