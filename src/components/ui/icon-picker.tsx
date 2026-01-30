"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import * as SimpleIcons from "@icons-pack/react-simple-icons";
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

// Brand logos from Simple Icons (use "brand:" prefix)
const brandLogos = {
  // Web Technologies
  webTech: [
    "brand:html5", "brand:css3", "brand:javascript", "brand:typescript",
    "brand:react", "brand:nextdotjs", "brand:vuedotjs", "brand:angular",
    "brand:nodedotjs", "brand:tailwindcss", "brand:bootstrap", "brand:sass"
  ],
  // Programming Languages
  progLang: [
    "brand:python", "brand:java", "brand:cplusplus", "brand:csharp",
    "brand:php", "brand:go", "brand:rust", "brand:swift", "brand:kotlin"
  ],
  // Databases
  dbBrands: [
    "brand:postgresql", "brand:mysql", "brand:mongodb", "brand:redis",
    "brand:sqlite", "brand:mariadb", "brand:oracle", "brand:microsoftsqlserver"
  ],
  // Design Tools
  designBrands: [
    "brand:figma", "brand:adobephotoshop", "brand:adobeillustrator",
    "brand:adobexd", "brand:canva", "brand:sketch", "brand:blender"
  ],
  // Microsoft Office
  officeBrands: [
    "brand:microsoftexcel", "brand:microsoftword", "brand:microsoftpowerpoint",
    "brand:microsoftoutlook", "brand:microsoft", "brand:microsoftoffice"
  ],
  // Video & Media
  mediaBrands: [
    "brand:adobepremierepro", "brand:adobeaftereffects", "brand:davinciresolve",
    "brand:youtube", "brand:vimeo", "brand:spotify"
  ],
  // Version Control
  versionBrands: [
    "brand:git", "brand:github", "brand:gitlab", "brand:bitbucket"
  ],
  // Cloud & DevOps
  cloudBrands: [
    "brand:amazonaws", "brand:googlecloud", "brand:microsoftazure",
    "brand:docker", "brand:kubernetes", "brand:vercel", "brand:netlify"
  ]
};

// Lucide icon categories
const iconCategories = {
  languages: [
    "Code", "Code2", "FileCode", "Terminal", "Binary", "Braces"
  ],
  webDev: [
    "Globe", "Layout", "Component", "Blocks"
  ],
  databases: [
    "Database", "Server", "HardDrive", "Table"
  ],
  design: [
    "Pen", "Palette", "Brush", "Image"
  ],
  tools: [
    "Settings", "Wrench", "Tool"
  ]
};

// Get unique icons from all categories
const allPopularIcons = [
  ...Object.values(brandLogos).flat(),
  ...Object.values(iconCategories).flat()
];

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

  // Get all brand names
  const allBrandNames = React.useMemo(() => {
    return Object.values(brandLogos).flat();
  }, []);

  // Filter icons based on search - FIXED
  const filteredIcons = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      return allPopularIcons;
    }
    
    const results: string[] = [];
    
    // Search brand logos first (priority)
    allBrandNames.forEach((brandName) => {
      const cleanName = brandName.replace("brand:", "").toLowerCase();
      if (cleanName.includes(query)) {
        results.push(brandName);
      }
    });
    
    // Search Lucide icons
    allIconNames.forEach((name) => {
      if (name.toLowerCase().includes(query)) {
        results.push(name);
      }
    });
    
    return results.slice(0, 120);
  }, [searchQuery, allBrandNames, allIconNames]);

  // Get the selected icon component
  const SelectedIcon = React.useMemo(() => {
    if (!value) return null;
    
    if (value.startsWith("brand:")) {
      const brandName = value.replace("brand:", "");
      const pascalName = "Si" + brandName.charAt(0).toUpperCase() + brandName.slice(1)
        .replace("dotjs", "Dotjs")
        .replace("dotnet", "Dotnet")
        .replace("plusplus", "Plusplus");
      return (SimpleIcons as any)[pascalName];
    }
    
    return (LucideIcons as any)[value];
  }, [value]);

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
              <span className="truncate">{value.replace("brand:", "")}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search: html, python, excel, figma, sql..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[450px]">
            <CommandEmpty>No icon found.</CommandEmpty>
            
            {!searchQuery ? (
              <>
                {/* Brand Logos */}
                {Object.entries(brandLogos).map(([categoryKey, icons]) => {
                  const brandCategoryNames: Record<string, string> = {
                    webTech: "🔥 Web (HTML, CSS, JS, React, Next.js)",
                    progLang: "💻 Languages (Python, Java, C++, PHP)",
                    dbBrands: "🗄️ Databases (PostgreSQL, MySQL, MongoDB)",
                    officeBrands: "📊 MS Office (Excel, Word, PowerPoint)",
                    designBrands: "🎨 Design (Figma, Photoshop, Illustrator)",
                    mediaBrands: "🎬 Video (Premiere, After Effects)",
                    versionBrands: "📦 Git (GitHub, GitLab)",
                    cloudBrands: "☁️ Cloud (AWS, Azure, Docker)"
                  };
                  
                  return (
                    <CommandGroup key={categoryKey} heading={brandCategoryNames[categoryKey]}>
                      <div className="grid grid-cols-8 gap-1 p-2">
                        {icons.map((iconName) => {
                          const brandName = iconName.replace("brand:", "");
                          const pascalName = "Si" + brandName.charAt(0).toUpperCase() + brandName.slice(1)
                            .replace("dotjs", "Dotjs")
                            .replace("dotnet", "Dotnet")
                            .replace("plusplus", "Plusplus");
                          const Icon = (SimpleIcons as any)[pascalName];
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
                              title={brandName}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="text-[10px] text-center truncate w-full">
                                {brandName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </CommandGroup>
                  );
                })}
                
                {/* Lucide Icons */}
                {Object.entries(iconCategories).map(([categoryKey, icons]) => {
                  const categoryNames: Record<string, string> = {
                    languages: "Programming (Generic)",
                    webDev: "Web Dev (Generic)",
                    databases: "Databases (Generic)",
                    design: "Design (Generic)",
                    tools: "Tools"
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
                })}
              </>
            ) : (
              <CommandGroup>
                <div className="grid grid-cols-8 gap-1 p-2">
                  {filteredIcons.map((iconName) => {
                    let Icon;
                    let displayName = iconName;
                    
                    if (iconName.startsWith("brand:")) {
                      const brandName = iconName.replace("brand:", "");
                      displayName = brandName;
                      const pascalName = "Si" + brandName.charAt(0).toUpperCase() + brandName.slice(1)
                        .replace("dotjs", "Dotjs")
                        .replace("dotnet", "Dotnet")
                        .replace("plusplus", "Plusplus");
                      Icon = (SimpleIcons as any)[pascalName];
                    } else {
                      Icon = (LucideIcons as any)[iconName];
                    }
                    
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
                        title={displayName}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[10px] text-center truncate w-full">
                          {displayName}
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
