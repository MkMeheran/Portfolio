// Optimized icon registry - lazy loaded icons
// Only load icons when needed, not all at once

import { lazy } from "react";
import type { LucideIcon } from "lucide-react";

// Icon loader function - dynamically imports icons
export function getIcon(name: string): LucideIcon | null {
  try {
    // Use dynamic import for lucide-react icons
    const icons = require("lucide-react");
    return icons[name] || null;
  } catch {
    return null;
  }
}

// Commonly used icons - pre-loaded for better performance
export const commonIcons = {
  // Admin navigation
  "layout-dashboard": lazy(() => import("lucide-react").then(m => ({ default: m.LayoutDashboard }))),
  "user": lazy(() => import("lucide-react").then(m => ({ default: m.User }))),
  "briefcase": lazy(() => import("lucide-react").then(m => ({ default: m.Briefcase }))),
  "wrench": lazy(() => import("lucide-react").then(m => ({ default: m.Wrench }))),
  "graduation-cap": lazy(() => import("lucide-react").then(m => ({ default: m.GraduationCap }))),
  "award": lazy(() => import("lucide-react").then(m => ({ default: m.Award }))),
  "image": lazy(() => import("lucide-react").then(m => ({ default: m.Image }))),
  "settings": lazy(() => import("lucide-react").then(m => ({ default: m.Settings }))),
};

// Icon categories for picker - lightweight metadata only
export const iconCategories = {
  "Navigation & UI": ["Home", "User", "Briefcase", "GraduationCap", "Wrench", "Award", "Mail", "Phone", "MapPin", "Calendar", "ExternalLink", "Menu", "Search", "Filter", "Settings"],
  "Social": ["Github", "Linkedin", "Facebook", "Twitter", "Instagram", "Youtube", "Globe"],
  "Development": ["Code", "Code2", "Brain", "Target", "Cpu", "Database", "Server", "HardDrive"],
  "Actions": ["Eye", "Heart", "Star", "Sparkles", "Zap", "Download", "Upload", "Send", "Plus", "Minus", "X", "Check", "CheckCircle", "Edit", "Pencil", "Trash", "Copy", "Link"],
  "Charts": ["TrendingUp", "TrendingDown", "BarChart3", "PieChart", "Activity"],
  "Layout": ["Layers", "Box", "Boxes", "Package", "FolderOpen", "Grid", "List", "LayoutGrid", "Table"],
  "Files": ["FileText", "File", "Image", "Video", "Music", "Camera"],
  "Lifestyle": ["Gamepad2", "Plane", "BookOpen", "Coffee", "Palette", "Paintbrush"],
  "Location": ["Building", "Building2", "Map", "MapPinned", "Navigation", "Compass", "Mountain"],
  "Weather": ["Sun", "Moon", "Cloud", "Thermometer", "Wind", "Waves", "TreePine", "Leaf", "Flower"],
  "Devices": ["Monitor", "Smartphone", "Tablet", "Laptop", "Keyboard", "Printer", "Wifi"],
  "Science": ["Rocket", "Atom", "Microscope", "TestTube", "Beaker", "Flask", "Dna"],
  "Finance": ["Banknote", "Coins", "CreditCard", "Wallet", "Calculator", "DollarSign"],
  "Achievement": ["Trophy", "Medal", "BadgeCheck", "Ribbon", "Gift", "Crown", "Gem"],
};

// Get all icon names (flat list)
export function getAllIconNames(): string[] {
  return Object.values(iconCategories).flat();
}

export type IconName = string;
