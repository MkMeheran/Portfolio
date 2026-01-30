"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Comprehensive icon categories with all major tools, languages, and skills
const iconCategories = {
  // Programming Languages
  languages: [
    "Code", "Code2", "FileCode", "FileCode2", "Terminal",
    "Braces", "Binary", "FileJson", "FileType", "Regex",
    "FileCode", "Brackets", "CodeXml"
  ],
  // Web Development (HTML, CSS, JavaScript, Next.js, React)
  webDev: [
    "Globe", "Globe2", "Monitor", "Layout", "LayoutGrid", "LayoutDashboard",
    "Component", "Blocks", "PanelTop", "Palette", "Paintbrush",
    "Code", "Code2", "CodeXml", "FileCode", "FileCode2",
    "Braces", "Binary", "Brackets", "Tag", "Tags"
  ],
  // Databases & SQL
  databases: [
    "Database", "Server", "HardDrive", "Table", "Table2", "Columns3",
    "Sheet", "FileSpreadsheet", "BarChart", "LineChart", "PieChart",
    "TableProperties", "Rows3", "TableCellsMerge", "TableCellsSplit",
    "Cylinder", "PackageOpen", "Archive"
  ],
  // Version Control
  versionControl: [
    "GitBranch", "GitCommit", "GitPullRequest", "GitMerge", "Github",
    "Gitlab", "GitFork", "GitCompare"
  ],
  // Cloud & DevOps
  cloudDevops: [
    "Cloud", "CloudUpload", "CloudDownload", "Container", "Package",
    "Boxes", "Network", "Workflow"
  ],
  // Development Tools
  devTools: [
    "Bug", "Cpu", "Activity", "Zap", "TestTube",
    "Microscope", "FlaskConical", "Hash"
  ],
  // Design & Graphics (Figma, Photoshop, Illustrator, Canva)
  design: [
    "Pen", "PenTool", "Image", "Images",
    "Camera", "Video", "Film", "Layers", "Grid3x3", "Shapes",
    "Brush", "Pipette", "Scissors", "Crop",
    "Palette", "Paintbrush", "PaintBucket", "PenTool", "Pencil",
    "Figma", "Combine", "Wand2", "Eraser", "Scan"
  ],
  // Video & Multimedia (CapCut, Video Editing)
  videoEditing: [
    "Video", "Film", "Clapperboard", "Camera", "VideoOff",
    "Play", "Pause", "PlayCircle", "StepForward", "StepBack",
    "Scissors", "Slice", "Split", "Combine", "Wand2"
  ],
  // Microsoft Office & Productivity
  office: [
    "FileSpreadsheet", "FileText", "FileType", "FileCheck",
    "Presentation", "File", "Files", "FolderOpen", "Folder",
    "Table", "Sheet", "AlignLeft", "List", "Grid3x3"
  ],
  // Data Science & AI
  dataScience: [
    "Brain", "BrainCircuit", "TrendingUp",
    "BarChart3", "Gauge"
  ],
  // GIS & Mapping
  gis: [
    "Map", "MapPin", "MapPinned", "Navigation", "Compass",
    "Maximize", "Minimize"
  ],
  // Research & Academic
  research: [
    "GraduationCap", "BookOpen", "Book", "Library",
    "FileText", "FileSearch", "Search",
    "Lightbulb", "Target", "Crosshair"
  ],
  // Communication
  communication: [
    "Mail", "MessageSquare", "MessageCircle", "Phone", "PhoneCall",
    "Mic", "Radio", "Wifi", "Rss", "Broadcast", "Share2",
    "Send", "AtSign"
  ],
  // Social & Community
  social: [
    "Users", "User", "UserPlus", "UserCheck", "Heart", "ThumbsUp",
    "Star", "Bookmark", "Share", "HandHeart", "Handshake", "Users2"
  ],
  // Volunteering & Charity
  volunteering: [
    "HeartHandshake", "Medal", "Trophy", "Gift", "Gem"
  ],
  // Business & Office
  business: [
    "Briefcase", "Building", "Building2", "Store", "ShoppingCart",
    "CreditCard", "DollarSign", "Award"
  ],
  // Files & Documents
  files: [
    "File", "Folder", "FolderOpen", "Save",
    "Download", "Upload", "Paperclip", "Link2", "Archive"
  ],
  // Education & Learning
  education: [
    "School", "NotebookPen", "Certificate"
  ],
  // Tools & Settings
  tools: [
    "Settings", "Wrench", "Hammer", "Tool", "Cog", "Sliders",
    "Filter", "Power", "Shield", "Lock", "Key"
  ],
  // Time & Calendar
  time: [
    "Clock", "Calendar", "CalendarDays", "Timer", "AlarmClock",
    "Watch", "Hourglass", "History", "RefreshCw", "RotateCw"
  ],
  // Media & Entertainment
  media: [
    "Music", "Headphones", "Speaker", "Volume2", "Play", "Pause"
  ],
  // Navigation & Location
  navigation: [
    "Home", "ArrowRight", "ArrowLeft", "ChevronRight", "Menu", "MoreHorizontal", "Move"
  ],
  // Actions & Status
  actions: [
    "Check", "CheckCircle", "CheckCircle2", "X", "XCircle", "Plus",
    "Minus", "Edit", "Trash", "Trash2"
  ],
  // Science & Lab
  science: [
    "Atom", "Dna", "Flame"
  ],
  // Nature & Weather
  weather: [
    "Sun", "Moon", "CloudRain", "CloudSnow", "Wind",
    "Snowflake", "Thermometer", "Droplet", "Umbrella", "Leaf", "Trees"
  ],
  // Misc & Special
  misc: [
    "Sparkles", "Rocket", "Crown", "Flag", "Eye", "Glasses", "Smile", "Laugh", "Dice5"
  ]
};

// Get unique icons from all categories
const allPopularIcons = [...new Set(Object.values(iconCategories).flat())];

interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function IconPicker({ value, onChange, placeholder = "Select icon..." }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Get all icon names from lucide-react
  const allIconNames = React.useMemo(() => {
    return Object.keys(LucideIcons).filter(
      (key) => key !== "createLucideIcon" && key !== "default"
    );
  }, []);

  // Filter icons based on search
  const filteredIcons = React.useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      return allPopularIcons;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const uniqueIcons = new Set<string>();
    
    allIconNames.forEach((name) => {
      if (name.toLowerCase().includes(query)) {
        uniqueIcons.add(name);
      }
    });
    
    return Array.from(uniqueIcons).slice(0, 120);
  }, [searchQuery, allIconNames]);

  // Get the selected icon component
  const SelectedIcon = value ? (LucideIcons as any)[value] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-mono text-sm"
        >
          {value ? (
            <div className="flex items-center gap-2">
              {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
              <span className="truncate">{value}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600 (Python, JS, HTML, CSS)",
                  webDev: "Web Dev (HTML, CSS, JS, Next.js)",
                  databases: "Databases (SQL, PostgreSQL)",
                  versionControl: "Version Control",
                  cloudDevops: "Cloud/DevOps",
                  devTools: "Dev Tools",
                  design: "Design (Figma, Photoshop, Illustrator, Canva)",
                  videoEditing: "Video Editing (CapCut)",
                  office: "Office (Excel, Word, PowerPoint, MS 365)
          <CommandList className="max-h-[450px]">
            <CommandEmpty>No icon found.</CommandEmpty>
            
            {!searchQuery ? (
              // Show categorized icons when not searching
              Object.entries(iconCategories).map(([categoryKey, icons]) => {
                const categoryNames: Record<string, string> = {
                  languages: "Languages",
                  webDev: "Web Dev",
                  databases: "Databases",
                  versionControl: "Version Control",
                  cloudDevops: "Cloud/DevOps",
                  devTools: "Dev Tools",
                  design: "Design",
                  dataScience: "Data Science",
                  gis: "GIS/Mapping",
                  research: "Research",
                  communication: "Communication",
                  social: "Social",
                  volunteering: "Volunteering",
                  business: "Business",
                  files: "Files",
                  education: "Education",
                  tools: "Tools",
                  time: "Time",
                  media: "Media",
                  navigation: "Navigation",
                  actions: "Actions",
                  science: "Science",
                  weather: "Weather",
                  misc: "Miscellaneous"
                };
                
                return (
                  <CommandGroup key={categoryKey} heading={categoryNames[categoryKey]}>
                    <div className="grid grid-cols-8 gap-1 p-2">
                      {icons.map((iconName) => {
                        const Icon = (LucideIcons as any)[iconName];
                        if (!Icon) return null;
                        
                        return (
                          <button
                            key={`${categoryKey}-${iconName}`}
                            onClick={() => {
                              onChange(iconName);
                              setOpen(false);
                              setSearchQuery("");
                            }}
                            className={cn(
                              "flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent transition-colors",
                              value === iconName && "bg-accent"
                            )}
                            title={iconName}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-[10px] text-center truncate w-full">
                              {iconName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </CommandGroup>
                );
              })
            ) : (
              // Show search results
              <CommandGroup>
                <div className="grid grid-cols-8 gap-1 p-2">
                  {filteredIcons.map((iconName) => {
                    const Icon = (LucideIcons as any)[iconName];
                    if (!Icon) return null;
                    
                    return (
                      <button
                        key={`search-${iconName}`}
                        onClick={() => {
                          onChange(iconName);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent transition-colors",
                          value === iconName && "bg-accent"
                        )}
                        title={iconName}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[10px] text-center truncate w-full">
                          {iconName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
