// Real data from Mokammel Morshed's portfolio
// Sources: https://meheran-portfolio.vercel.app/ & https://udyomxorg.vercel.app/

import type { Project, Writing, LearningStat, Skill, Experience, Education } from "@/types/database.types";

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Simple WebGIS Dashboard",
    slug: "simple-webgis-dashboard",
    description: "My first WebGIS project - from QGIS struggles to Leaflet maps. A dual-map viewer showing Bangladesh administrative data with optimized performance. Features district-level overview and union-level detailed views.",
    content: `## Building My First WebGIS Project: From QGIS Struggles to Leaflet Maps

This was my very first project diving into the world of GIS (Geographic Information Systems). The journey took me from understanding raw shapefiles in QGIS to building an interactive web map using Leaflet JS.

### Key Learnings:
- Layer management & Selection
- Attribute Table manipulation & Filtering
- Processing tools (Refactor Fields)
- Importance of EPSG:4326 & GeoJSON
- File optimization with Mapshaper`,
    category: "gis",
    tech_stack: ["QGIS", "Leaflet", "JavaScript", "HTML", "CSS", "GeoJSON"],
    demo_link: "https://mkmeheran.github.io/Urban_Web_Dashboard_Project001/",
    repo_link: "https://github.com/MkMeheran/Urban_Web_Dashboard_Project001.git",
    image_url: "https://nzeglwdodpurbbygaqpf.supabase.co/storage/v1/object/public/gallery/Screenshot_2025_12_24_093423_1766568324831_xf4keb.png",
    featured: true,
    published: true,
    created_at: "2025-12-24T00:00:00Z",
    updated_at: "2025-12-24T00:00:00Z",
  },
  {
    id: "2",
    title: "Responsive Student Portfolio",
    slug: "responsive-student-portfolio",
    description: "A fully responsive personal portfolio website built using HTML, CSS, and JavaScript. Showcases student achievements, projects, and contact information with a clean UI and mobile-friendly design.",
    content: `## Student Portfolio Website

Built a responsive portfolio to showcase academic and project achievements.

### Features:
- Mobile-first responsive design
- Clean and modern UI
- Project showcase section
- Contact form integration`,
    category: "web",
    tech_stack: ["HTML", "CSS", "JavaScript"],
    demo_link: "https://meheran216.github.io/Kueturp/",
    repo_link: "https://github.com/meheran216/Kueturp",
    // mock-data removed — placeholders are used instead
    export const __DELETED_MOCK_DATA = true;
- Green space impact assessment

## Key Findings

The analysis reveals significant temperature variations between urban cores and peripheral areas, highlighting the need for green infrastructure in urban planning.`,
    type: "academic",
    tags: ["urban-planning", "climate", "remote-sensing", "research", "gis"],
    cover_image: "https://meheran-portfolio.vercel.app/assets/urp.webp",
    published: true,
    published_at: "2025-07-15T00:00:00Z",
    created_at: "2025-07-15T00:00:00Z",
    updated_at: "2025-07-15T00:00:00Z",
  },
  {
    id: "3",
    title: "Self-Learning Journey: Web Development to GIS",
    slug: "self-learning-journey",
    excerpt: "Documenting my path of self-learning web development, design tools, and GIS technologies while studying Urban Planning at KUET.",
    content: `# My Self-Learning Journey

As a URP student at KUET, I've been on a parallel journey of self-learning technology skills that complement my academic background.

## Web Development
- HTML, CSS, JavaScript — responsive layouts, DOM handling
- React — component-based UI, state management basics
- SEO — on-page optimization

## Design & Creative Tools
- Photoshop — image editing, UI mockups
- Illustrator — vector graphics, posters

## Writing & Productivity
- Microsoft Word — structured reports, formatting
- Excel — data organization, formulas, charting
- PowerPoint — academic and professional presentations

The goal is to bridge urban planning knowledge with technical skills to create impactful solutions.`,
    type: "tech",
    tags: ["self-learning", "web-development", "career", "skills"],
    cover_image: null,
    published: true,
    published_at: "2025-09-15T00:00:00Z",
    created_at: "2025-09-15T00:00:00Z",
    updated_at: "2025-09-15T00:00:00Z",
  },
  {
    id: "4",
    title: "IELTS & German A1 Learning Experience",
    slug: "language-learning-experience",
    excerpt: "Sharing my experience preparing for IELTS and learning German A1 as part of my goal to pursue higher education in Germany.",
    content: `# Language Learning Journey

As part of my goal to pursue Master's in Germany, I've been focusing on language skills.

## IELTS Preparation
- Focused mainly on test strategies and practice tests
- Sharpened academic writing formats
- Speaking practice under exam conditions
- Already at advanced level — emphasis on polishing academic tone

## German A1 Learning
- Alphabet & pronunciation
- Basic grammar (nouns, verbs, articles)
- Everyday phrases & dialogues
- Listening & speaking exercises

The journey continues toward B2 proficiency!`,
    type: "literature",
    tags: ["ielts", "german", "language-learning", "germany", "higher-education"],
    cover_image: null,
    published: true,
    published_at: "2025-09-01T00:00:00Z",
    created_at: "2025-09-01T00:00:00Z",
    updated_at: "2025-09-01T00:00:00Z",
  },
];

export const mockLearningStats: LearningStat[] = [
  {
    id: "1",
    metric_name: "LeetCode Problems",
    metric_type: "leetcode",
    current_value: 47,
    target_value: 300,
    description: "Daily problem-solving practice",
    icon: "code",
    last_updated: "2026-01-30T00:00:00Z",
    created_at: "2025-06-01T00:00:00Z",
  },
  {
    id: "2",
    metric_name: "GIS Projects",
    metric_type: "gis_projects",
    current_value: 8,
    target_value: 52,
    description: "One map per week challenge",
    icon: "map",
    last_updated: "2026-01-28T00:00:00Z",
    created_at: "2025-06-01T00:00:00Z",
  },
  {
    id: "3",
    metric_name: "German Language",
    metric_type: "language",
    current_value: 25,
    target_value: 100,
    description: "A1 → B2 Progress",
    icon: "languages",
    last_updated: "2026-01-29T00:00:00Z",
    created_at: "2025-06-01T00:00:00Z",
  },
  {
    id: "4",
    metric_name: "Kaggle Notebooks",
    metric_type: "kaggle",
    current_value: 12,
    target_value: 50,
    description: "Data science practice",
    icon: "trophy",
    last_updated: "2026-01-25T00:00:00Z",
    created_at: "2025-06-01T00:00:00Z",
  },
];

export const mockSkills: Skill[] = [
  // GIS Tools
  { id: "1", name: "ArcGIS Pro", category: "planning", proficiency: 80, icon: "map", order: 1, created_at: "" },
  { id: "2", name: "QGIS", category: "planning", proficiency: 85, icon: "map", order: 2, created_at: "" },
  { id: "3", name: "Leaflet", category: "planning", proficiency: 75, icon: "map", order: 3, created_at: "" },
  
  // Programming
  { id: "4", name: "Python", category: "technical", proficiency: 70, icon: "code", order: 1, created_at: "" },
  { id: "5", name: "JavaScript", category: "technical", proficiency: 80, icon: "code", order: 2, created_at: "" },
  { id: "6", name: "React", category: "technical", proficiency: 75, icon: "code", order: 3, created_at: "" },
  { id: "7", name: "HTML/CSS", category: "technical", proficiency: 90, icon: "code", order: 4, created_at: "" },
  
  // Office Tools
  { id: "8", name: "Microsoft Word", category: "tools", proficiency: 90, icon: "file", order: 1, created_at: "" },
  { id: "9", name: "Microsoft Excel", category: "tools", proficiency: 85, icon: "table", order: 2, created_at: "" },
  { id: "10", name: "PowerPoint", category: "tools", proficiency: 85, icon: "presentation", order: 3, created_at: "" },
  
  // Design Tools
  { id: "11", name: "Photoshop", category: "tools", proficiency: 75, icon: "image", order: 4, created_at: "" },
  { id: "12", name: "Illustrator", category: "tools", proficiency: 65, icon: "pen", order: 5, created_at: "" },
  { id: "13", name: "Canva", category: "tools", proficiency: 85, icon: "palette", order: 6, created_at: "" },
  
  // Soft Skills
  { id: "14", name: "Academic Writing", category: "soft", proficiency: 80, icon: "edit", order: 1, created_at: "" },
  { id: "15", name: "Communication", category: "soft", proficiency: 85, icon: "message", order: 2, created_at: "" },
  { id: "16", name: "Problem Solving", category: "soft", proficiency: 80, icon: "lightbulb", order: 3, created_at: "" },
];

export const mockExperiences: Experience[] = [
  {
    id: "1",
    title: "Skill Development (Self-Learning)",
    organization: "Self Learning",
    location: "Remote",
    type: "work",
    description: "Web Development: HTML, CSS, JavaScript, React, SEO. Design & Creative Tools: Photoshop, Illustrator. Writing & Productivity: Microsoft Word, Excel, PowerPoint.",
    start_date: "2025-04-01",
    end_date: "2025-09-30",
    current: false,
    order: 1,
    created_at: "",
  },
  {
    id: "2",
    title: "Language Learning (IELTS & German A1)",
    organization: "Self Learning",
    location: "Remote",
    type: "work",
    description: "IELTS Preparation: Test strategies, academic writing, speaking practice. German A1: Alphabet, basic grammar, everyday phrases, listening exercises.",
    start_date: "2025-05-01",
    end_date: "2025-09-30",
    current: false,
    order: 2,
    created_at: "",
  },
  {
    id: "3",
    title: "Founder",
    organization: "UdyomX ORG",
    location: "Dhaka, Bangladesh",
    type: "work",
    description: "Building exceptional digital experiences with modern technologies and creative solutions. Web Development, UI/UX Design, Consulting, Custom Solutions.",
    start_date: "2025-01-01",
    end_date: null,
    current: true,
    order: 3,
    created_at: "",
  },
];

export const mockEducation: Education[] = [
  {
    id: "1",
    degree: "B.URP (Bachelor of Urban & Regional Planning)",
    institution: "Khulna University of Engineering & Technology (KUET)",
    location: "Khulna, Bangladesh",
    field: "Urban & Regional Planning",
    gpa: null,
    start_date: "2025-08-01",
    end_date: null,
    current: true,
    achievements: ["Student ID: 2417012"],
    order: 1,
    created_at: "",
  },
  {
    id: "2",
    degree: "HSC 2024",
    institution: "Bangladesh Chemical Industries Corporation College",
    location: "Dhaka, Bangladesh",
    field: "Science",
    gpa: 5.0,
    start_date: "2022-02-01",
    end_date: "2024-06-30",
    current: false,
    achievements: ["GPA 5.00"],
    order: 2,
    created_at: "",
  },
  {
    id: "3",
    degree: "SSC 2022",
    institution: "Ataturk Govt. Model High School",
    location: "Feni, Bangladesh",
    field: "Science",
    gpa: 5.0,
    start_date: "2017-01-01",
    end_date: "2021-07-31",
    current: false,
    achievements: ["GPA 5.00"],
    order: 3,
    created_at: "",
  },
  {
    id: "4",
    degree: "JSC 2019",
    institution: "Ataturk Govt. Model High School",
    location: "Feni, Bangladesh",
    field: "General",
    gpa: 4.56,
    start_date: "2017-01-01",
    end_date: "2019-11-30",
    current: false,
    achievements: ["GPA 4.56"],
    order: 4,
    created_at: "",
  },
];

// Profile Information
export const mockProfile = {
  name: "Mokammel Morshed",
  title: "Urban & Regional Planning Student",
  subtitle: "KUET | Student ID: 2417012",
  bio: `I bring together urban planning and future-focused technology. My work blends spatial thinking with practical skills in AI — including generative tools (ChatGPT, Gemini), computer vision, automation, and data-driven workflows.

Alongside this, I have experience in modern Web Development, UI design, SEO, content creation, and productivity systems. I'm also skilled with tools like React, Canva, Photoshop, Word, Excel, and Notion.

Through my portfolio, I aim to showcase not just what I've learned, but also how I apply technology to solve real-world planning and communication challenges.`,
  location: "Feni, Bangladesh",
  email: "mdmokammelmorshed@gmail.com",
  phone: "+880 1234 567890",
  avatar: "https://meheran-portfolio.vercel.app/assets/Meheran.jpg",
  social: {
    github: "https://github.com/meheran216",
    linkedin: "https://www.linkedin.com/in/mokammel-morshed-59108a366/",
    facebook: "https://www.facebook.com/Meheran216/",
    twitter: "https://twitter.com/Meheran_3005",
    whatsapp: "https://wa.link/rqd8sv",
  },
};

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== "your_supabase_project_url";
}
