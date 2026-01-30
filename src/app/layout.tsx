import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Space_Mono } from "next/font/google";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";
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

export const metadata: Metadata = {
  title: {
    default: "MD MOKAMMEL MORSHED — Urban Planner & Developer",
    template: "%s | MD MOKAMMEL MORSHED",
  },
  description:
    "MD MOKAMMEL MORSHED — Urban & Regional Planning student at KUET. Web Developer and GIS Analyst combining spatial thinking with modern web development.",
  keywords: [
    "MD MOKAMMEL MORSHED",
    "Mokammel",
    "Morshed",
    "Meheran",
    "Urban Planning",
    "GIS",
    "Web Developer",
    "Portfolio",
  ],
  authors: [{ name: "MD MOKAMMEL MORSHED" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "meheran-portfolio.vercel.app",
    url: "https://meheran-portfolio.vercel.app",
    images: [],
  },
  metadataBase: new URL("https://meheran-portfolio.vercel.app"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // fetch profile on server to use avatar as favicon
  const [faviconUrl] = (() => {
    let url = "/favicon.ico";
    try {
      // Note: createServerSupabase returns a promise; call synchronously is not possible here.
      // We'll leave favicon to be set client-side if profile available.
    } catch {}
    return [url];
  })();
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
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
