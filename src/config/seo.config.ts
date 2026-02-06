/**
 * ═══════════════════════════════════════════════════════════════
 * 🎯 MASTER SEO CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * এই ফাইলে আপনার সব SEO info edit করতে পারবেন।
 * যেকোনো জায়গায় পরিবর্তন করে save করলেই পুরো site এ update হবে।
 * 
 * ⚠️ IMPORTANT: 
 * - সব URL এ https:// দিন
 * - Image গুলো public folder এ রাখুন
 * - Social links সঠিক আছে কিনা verify করুন
 */

export const seoConfig = {
  // ═══════════════════════════════════════════════════════════════
  // 👤 PERSONAL INFORMATION (এখানে আপনার info edit করুন)
  // ═══════════════════════════════════════════════════════════════
  personal: {
    // আপনার পুরো নাম
    fullName: "Md. Mokammel Morshed",
    
    // আপনার ডাক নাম / Aliases (যেসব নামে মানুষ খুঁজতে পারে)
    aliases: ["Mokammel", "Morshed", "Mokammel Morshed", "Meheran"],
    
    // আপনার পেশা বা identity
    tagline: "Geospatial Urban & Supply Data Scientist, Data Analyst & Developer",
    
    // Short bio (1-2 lines, SEO friendly)
    shortBio: "Urban & Regional Planning student at KUET, passionate about bridging urban planning with cutting-edge technology through GIS, Data Science, and Web Development.",
    
    // Long bio (About page এর জন্য)
    longBio: "I am an Urban and Regional Planning (URP) undergraduate at KUET, Bangladesh. My passion lies at the intersection of Urban Data Science and Geospatial Analysis. Currently mastering Python, GIS, Data Science and supply chain management analysis to create smart urban solutions. I aim to pursue higher studies in abroad to further specialize in tech-driven urban planning.",
    
    // ছবির URL - এখন database থেকে dynamically load হবে
    // Fallback হিসেবে এই paths use হবে
    imageFallback: "/og-image.jpg",
    profileImageFallback: "/profile.jpg",
  },

  // ═══════════════════════════════════════════════════════════════
  // 🌐 WEBSITE INFORMATION
  // ═══════════════════════════════════════════════════════════════
  site: {
    name: "Meheran's Portfolio",
    url: "https://meheran-portfolio.vercel.app",
    companyUrl: "https://udyomxorg.vercel.app",
    email: "mdmokammelmorshed@gmail.com", // আপনার email দিন
    phone: "+880-xxxx-xxxxxx", // Optional
  },

  // ═══════════════════════════════════════════════════════════════
  // 🔗 SOCIAL MEDIA LINKS
  // ═══════════════════════════════════════════════════════════════
  social: {
    facebook: "https://facebook.com/Meheran216", // আপনার FB link
    linkedin: "https://linkedin.com/in/mokammel-morshed-59108a366/", // আপনার LinkedIn
    twitter: "https://twitter.com/Meheran3005", // আপনার X/Twitter
    github: "https://github.com/MkMeheran", // GitHub (optional)
    instagram: "", // Optional
    youtube: "", // Optional
    kaggle: "", // Optional (Data Science profile থাকলে)
  },

  // ═══════════════════════════════════════════════════════════════
  // 🎓 EDUCATION & CAREER
  // ═══════════════════════════════════════════════════════════════
  education: {
    university: "Khulna University of Engineering & Technology (KUET)",
    universityUrl: "https://www.kuet.ac.bd/",
    department: "Urban and Regional Planning (BURP)",
    batch: "2024-2025",
    location: {
      city: "Khulna",
      country: "Bangladesh",
      countryCode: "BD",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 💼 PROFESSIONAL SKILLS & EXPERTISE
  // ═══════════════════════════════════════════════════════════════
  skills: {
    core: [
      "Urban Planning",
      "Geographic Information Systems (GIS)",
      "Data Science",
      "Supply Chain Management Analysis",
      "Data Analysis",
      "Web Development",
      "Geospatial Analysis",
    ],
    technical: [
      "Next.js", "React", "TypeScript", "Tailwind CSS",
      "Python", "SQL", "Supabase",
      "ArcGIS", "QGIS", "Remote Sensing",
      "Data Visualization", "Machine Learning",
    ],
    creative: [
      "Video Editing (CapCut)",
      "Documentary Making",
      "Content Creation",
      "UI/UX Design",
    ],
    languages: [
      "Bengali (Native)",
      "English (Fluent)",
      "German (Learning - A1/A2)",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 🎯 CAREER GOALS & ASPIRATIONS
  // ═══════════════════════════════════════════════════════════════
  goals: {
    shortTerm: [
      "Master Data Science and GIS",
      "Build innovative urban tech projects",
      
    ],
    longTerm: [
      "Study in abroad",
      "Work at top tech companies (Google, Microsoft)",
      "Become Urban Data Science Researcher",
      "Contribute to Smart City projects",
    ],
        impact: "Use technology to solve urban challenges and promote sustainable development in Bangladesh and globally.",
  },

  // ═══════════════════════════════════════════════════════════════
  // 🔍 SEO KEYWORDS (Search Engine এর জন্য)
  // ═══════════════════════════════════════════════════════════════
  keywords: {
    primary: [
      "Md Mokammel Morshed",
      "Mokammel Portfolio",
      "Meheran Developer",
      "KUET Urban and Regional Planning",
        "KUET Urban Data Analyst",
          "KUET Urban Data Scientist",
      "Bangladesh GIS Analyst",
      "Geospatial Data Scientist Bangladesh",
      "Supply Chain Management Analyst Bangladesh",
    ],
    secondary: [
      "Urban Data Scientist Bangladesh",
      "Next.js Portfolio Developer",
      "GIS Web Developer",
      "KUET Student Portfolio",
      "Study in abroad from Bangladesh",
      "Urban Planning Tech",
      "Geospatial Analysis Expert",
      "Smart City Planning Bangladesh",
    ],
    technical: [
      "Next.js Developer Bangladesh",
      "React TypeScript Portfolio",
      "Supabase Integration",
      "Tailwind CSS Expert",
      "Full Stack Developer Khulna",
      "QGIS Python Automation",
      "ArcGIS Pro Bangladesh",
    ],
    niche: [
      "Urban Data Science",
      "Sustainable Development Goals",
      "Spatial Data Analysis",
      "Video Documentary Maker",
      "Deutschlandstipendium Candidate",
      "German Language Learner Bangladesh",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 🌍 GEO-TARGETING (Location based SEO)
  // ═══════════════════════════════════════════════════════════════
  geo: {
    targetRegions: [
      { name: "Bangladesh", code: "BD" },
      { name: "Germany", code: "DE" },
      { name: "India", code: "IN" },
      { name: "Global", code: "GLOBAL" },
    ],
    localKeywords: [
      "Bangladesh Web Developer",
      "Khulna Tech Professional",
      "KUET Alumni Network",
      "Bengali Developer Portfolio",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 📱 OPEN GRAPH & SOCIAL PREVIEW
  // ═══════════════════════════════════════════════════════════════
  openGraph: {
    title: "Md. Mokammel Morshed | Urban Data Analyst & Developer",
    description: "Bridging Urban Planning with Technology through GIS, Data Science, and Modern Web Development. KUET Student aspiring for higher studies in Germany.",
    image: {
      // Database থেকে fetch করা হবে, না থাকলে fallback
      urlFallback: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Md. Mokammel Morshed Portfolio Cover",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 🤖 STRUCTURED DATA (JSON-LD Schema)
  // ═══════════════════════════════════════════════════════════════
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Md. Mokammel Morshed",
    alternateName: ["Mokammel", "Morshed", "Mokammel Morshed", "Meheran"],
    jobTitle: "Student & Aspiring Urban Data Scientist",
    description: "Urban Planning student at KUET blending geospatial analysis with modern technology to solve urban problems.",
    
    knowsAbout: [
      "Urban Planning",
      "Geographic Information Systems (GIS)",
      "Data Science",
      "Python Programming",
      "Web Development (Next.js, React)",
      "Video Editing",
      "German Language (A1/A2)",
    ],
    
    // আপনার skills এর proof (certificates, projects etc)
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "BURP in Urban and Regional Planning",
        educationalLevel: "Undergraduate",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ❓ FAQ (Frequently Asked Questions) - SEO boost করে
  // ═══════════════════════════════════════════════════════════════
  faq: [
    {
      question: "Who is Md. Mokammel Morshed?",
      answer: "I am an Urban and Regional Planning student at KUET, specializing in GIS,Data analysis, Geospatial Data Science, Supply chain Management and Web Development. I combine spatial thinking with modern technology to create innovative urban traffic solutions.",
    },
    {
      question: "What services or collaborations do you offer?",
      answer: "I specialize in GIS mapping, Data Analysis, Full Stack Web Development (Next.js/React), Video Editing, and Urban Planning consultancy.",
    },
    {
      question: "What are your future career goals?",
      answer: "My goal is to pursue higher studies in Germany and become an Urban Data Scientist, working on Smart City projects at top tech companies like Google or Microsoft.",
    },
    {
      question: "What is your academic background?",
      answer: "I am currently pursuing Bachelor of Urban and Regional Planning (BURP) at Khulna University of Engineering & Technology (KUET), Bangladesh.",
    },
    {
      question: "Do you have experience with Research?",
      answer: "Yes, I am actively involved in academic research projects at KUET focusing on Urban Data Science and Sustainable Development.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // 🚫 ROBOTS & CRAWLING
  // ═══════════════════════════════════════════════════════════════
  robots: {
    allow: ["/"],
    disallow: ["/admin", "/api"],
  },

  // ═══════════════════════════════════════════════════════════════
  // 🔐 VERIFICATION CODES
  // ═══════════════════════════════════════════════════════════════
  verification: {
    google: "", // Google Search Console verification code
    bing: "", // Bing Webmaster Tools verification code
  },
};

// ═══════════════════════════════════════════════════════════════
// 📊 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get all keywords as a single array
 */
export function getAllKeywords(): string[] {
  return [
    ...seoConfig.keywords.primary,
    ...seoConfig.keywords.secondary,
    ...seoConfig.keywords.technical,
    ...seoConfig.keywords.niche,
    ...seoConfig.geo.localKeywords,
  ];
}

/**
 * Get structured data as JSON-LD (static fallback version)
 */
export function getStructuredData() {
  return {
    ...seoConfig.structuredData,
    url: seoConfig.site.url,
    image: `${seoConfig.site.url}${seoConfig.personal.imageFallback}`,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: seoConfig.education.university,
      sameAs: seoConfig.education.universityUrl,
      department: seoConfig.education.department,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: seoConfig.education.location.city,
      addressCountry: seoConfig.education.location.country,
    },
    sameAs: Object.values(seoConfig.social).filter(Boolean),
    worksFor: {
      "@type": "Organization",
      name: seoConfig.education.university,
      sameAs: seoConfig.education.universityUrl,
    },
  };
}

/**
 * Get FAQ structured data
 */
export function getFAQStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seoConfig.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Get profile image from database or use fallback
 * এই function Supabase থেকে profile picture fetch করে
 */
export async function getProfileImage() {
  try {
    // Dynamic import to avoid server/client issues
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('profile')
      .select('avatar_url, cover_url')
      .single();
    
    if (error || !data) {
      return {
        avatar: seoConfig.personal.profileImageFallback,
        cover: seoConfig.openGraph.image.urlFallback,
      };
    }
    
    return {
      avatar: data.avatar_url || seoConfig.personal.profileImageFallback,
      cover: data.cover_url || data.avatar_url || seoConfig.openGraph.image.urlFallback,
    };
  } catch (error) {
    // Fallback if database fails
    return {
      avatar: seoConfig.personal.profileImageFallback,
      cover: seoConfig.openGraph.image.urlFallback,
    };
  }
}

/**
 * Get structured data with dynamic profile image
 */
export async function getDynamicStructuredData() {
  const images = await getProfileImage();
  
  return {
    ...seoConfig.structuredData,
    url: seoConfig.site.url,
    image: images.avatar.startsWith('http') 
      ? images.avatar 
      : `${seoConfig.site.url}${images.avatar}`,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: seoConfig.education.university,
      sameAs: seoConfig.education.universityUrl,
      department: seoConfig.education.department,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: seoConfig.education.location.city,
      addressCountry: seoConfig.education.location.country,
    },
    sameAs: Object.values(seoConfig.social).filter(Boolean),
    worksFor: {
      "@type": "Organization",
      name: seoConfig.education.university,
      sameAs: seoConfig.education.universityUrl,
    },
  };
}
