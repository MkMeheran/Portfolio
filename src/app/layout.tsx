import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Space_Mono } from "next/font/google";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import { seoConfig, getAllKeywords, getDynamicStructuredData, getProfileImage } from "@/config/seo.config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Generate dynamic metadata with profile image from database
export async function generateMetadata(): Promise<Metadata> {
  const images = await getProfileImage();
  const ogImage = images.cover || images.avatar;
  
  return {
    metadataBase: new URL(seoConfig.site.url),
    
    // Basic metadata
    title: {
      default: `${seoConfig.personal.fullName} | ${seoConfig.personal.tagline}`,
      template: `%s | ${seoConfig.personal.fullName}`,
    },
    description: seoConfig.personal.shortBio,
    keywords: getAllKeywords(),
    authors: [
      { 
        name: seoConfig.personal.fullName, 
        url: seoConfig.site.url 
      }
    ],
    creator: seoConfig.personal.fullName,
    publisher: seoConfig.personal.fullName,
    
    // Open Graph (Facebook, LinkedIn) - using dynamic profile image
    openGraph: {
      type: "website",
      locale: "en_US",
      url: seoConfig.site.url,
      siteName: seoConfig.site.name,
      title: seoConfig.openGraph.title,
      description: seoConfig.openGraph.description,
      images: [
        {
          url: ogImage,
          width: seoConfig.openGraph.image.width,
          height: seoConfig.openGraph.image.height,
          alt: seoConfig.openGraph.image.alt,
        },
      ],
    },
    
    // Twitter Card - using dynamic profile image
    twitter: {
      card: "summary_large_image",
      title: seoConfig.openGraph.title,
      description: seoConfig.openGraph.description,
      images: [ogImage],
      creator: seoConfig.social.twitter ? `@${seoConfig.social.twitter.split('/').pop()}` : undefined,
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    
    // Icons - using dynamic profile avatar
    icons: {
      icon: images.avatar,
      apple: images.avatar,
      shortcut: images.avatar,
    },
    
    // Verification codes (only include if configured)
    ...(seoConfig.verification.google || seoConfig.verification.bing ? {
      verification: {
        ...(seoConfig.verification.google && { google: seoConfig.verification.google }),
        ...(seoConfig.verification.bing && {
          other: {
            "msvalidate.01": seoConfig.verification.bing,
          },
        }),
      },
    } : {}),
    
    // Additional metadata
    applicationName: seoConfig.site.name,
    category: "Technology",
    classification: "Portfolio Website",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch dynamic profile images from database
  const structuredData = await getDynamicStructuredData();
  
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Favicon is handled by metadata.icons dynamically */}
        {/* JSON-LD Structured Data for Google (with dynamic profile image) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${spaceMono.variable} font-sans antialiased min-h-screen bg-background`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
