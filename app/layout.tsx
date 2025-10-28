import "./globals.css";
import ThemeLoader from "@/components/ThemeLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import data from "@/data/content.json";
import theme from "@/data/theme.json";
import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/orbitron/700.css";

export const metadata: Metadata = {
  title: "Meheran | GIS & Web GIS Portfolio",
  description:
    "Portfolio of Mokammel Morshed (Meheran) — GIS, Web GIS, Urban Planning, and modern web development projects.",
  keywords: [
    "Mokammel Morshed",
    "Meheran",
    "GIS Portfolio",
    "Web GIS",
    "Urban Planning",
    "Next.js Portfolio",
    "React Developer",
    "Frontend Backend Projects",
     "GIS Student", "WebGIS Learner", "GeoAI",
    "Urban Planning Data Science", "IELTS Preparation",
    "German Language Learning", "Streamlit", "GeoPandas", "Python GIS"
  ],
  authors: [{ name: "Mokammel Morshed" }],
   verification: {
    google: "yPE4By05HKPLCJixD1j0XOaJac_s8bd2QzyFsspipEA",
  },
  openGraph: {
    title: "Meheran | GIS & Web GIS Portfolio",
    description:
      "Explore projects on GIS, Web GIS, Urban Planning, and modern web development by Mokammel Morshed.",
    url: "https://meheran-portfolio.vercel.app/",
    siteName: "Meheran Portfolio",
    images: [
      {
        url: "/assets/Meheran.jpg", // 👈 আপনার portrait বা cover
        width: 1200,
        height: 630,
        alt: "Mokammel Morshed Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meheran | GIS & Web GIS Portfolio",
    description:
      "Explore GIS, Web GIS, Design and modern web development projects by Mokammel Morshed.",
    images: ["/assets/Meheran.jpg"], // 👈 same as OG image
    creator: "@your_twitter_handle", // চাইলে যোগ করুন
  },
  icons: {
    icon: "/assets/globe.svg", // 👈 favicon হিসেবে use করতে পারেন
  },
  metadataBase: new URL("https://meheran-portfolio.vercel.app/"), // 👈 আপনার domain দিন
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className="bg-[#000319] text-[var(--text)]" suppressHydrationWarning>

     
        <Script
          id="person-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": data.identity.name,
              "url": "https://meheran-portfolio.vercel.app/",
              "image": "https://meheran-portfolio.vercel.app/assets/Meheran.jpg",
              "sameAs": [
                "https://www.linkedin.com/in/mokammel-morshed-59108a366/",
        "https://github.com/meheran216",
        "https://www.facebook.com/Meheran216/",
        "https://www.reddit.com/user/Meheran216/",
        "https://www.instagram.com/mokammel_morshed/"
              ],
              "jobTitle": "Student | GIS & Web GIS Enthusiast | Web Developer | Canva, Photoshop Designer | Urban Data Science & WebGIS Learner",
             "alumniOf": [
        {
          "@type": "CollegeOrUniversity",
          "name": "Khulna University of Engineering & Technology (KUET)"
        },
        {
          "@type": "CollegeOrSchool",
          "name": "Bangladesh Chemical Industries Corporation College (BCIC College)"
        },
        {
          "@type": "School",
          "name": "Ataturk Govt. Model High School"
        }
      ],
               "knowsAbout": [
        "GIS", "Remote Sensing", "Urban Planning",
        "GeoPandas", "Python", "Machine Learning",
        "Streamlit", "WebGIS", "Dashboard Development",
        "IELTS Preparation", "German Language Learning"
      ],"hasOccupation": {
        "@type": "Occupation",
        "name": "Geo-Spatial Urban Data Analyst (in training)",
        "description": "Currently learning GIS tools, cartography, GeoAI, WebGIS, and dashboards while preparing for IELTS & German B1."
      }
            })
          }}
        />

       <ThemeLoader />


        {/* Navbar */}
        <Navbar theme={theme} />

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer
          footer={data.footer}
          identity={data.identity}
          theme={theme}
        />
      </body>
    </html>
  );
}
