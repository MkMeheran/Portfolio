"use client";

import * as React from "react";
import { ChevronsUpDown, Loader2 } from "lucide-react";
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

// Lazy load icon libraries only when picker is opened
const loadLucideIcons = () => import("lucide-react");
const loadSimpleIcons = () => import("@icons-pack/react-simple-icons");

// Popular brand icons (loaded on demand)
const brandCategories = {
  "🔥 Web": ["html5", "css3", "javascript", "typescript", "react", "nextdotjs", "vuedotjs", "angular", "nodedotjs", "tailwindcss"],
  "💻 Languages": ["python", "java", "cplusplus", "csharp", "php", "go", "rust"],
  "🗄️ Databases": ["postgresql", "mysql", "mongodb", "redis", "sqlite"],
  "📊 MS Office": ["microsoftexcel", "microsoftword", "microsoftpowerpoint"],
  "🎨 Design": ["figma", "adobephotoshop", "adobeillustrator", "canva"],
  "☁️ Cloud": ["amazonaws", "googlecloud", "microsoftazure", "docker", "vercel"],
};

// Generic icons (Lucide) - only names
const genericCategories = {
  "Programming": ["Code", "Code2", "Terminal", "Binary"],
  "Web": ["Globe", "Layout", "Component"],
  "Database": ["Database", "Server", "HardDrive"],
  "Design": ["Pen", "Palette", "Brush"],
  "Tools": ["Settings", "Wrench", "Tool"],
};

interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const IconPicker = React.memo(function IconPickerComponent({ value, onChange, placeholder = "Select icon..." }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [lucideIcons, setLucideIcons] = React.useState<any>(null);
  const [simpleIcons, setSimpleIcons] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  // Load icons only when picker opens
  React.useEffect(() => {
    if (open && !lucideIcons && !simpleIcons) {
      setLoading(true);
      Promise.all([loadLucideIcons(), loadSimpleIcons()])
        .then(([lucide, simple]) => {
          setLucideIcons(lucide);
          setSimpleIcons(simple);
        })
        .finally(() => setLoading(false));
    }
  }, [open, lucideIcons, simpleIcons]);

  // Get all brand names
  const allBrandNames = React.useMemo(() => {
    return Object.values(brandCategories).flat().map(name => `brand:${name}`);
  }, []);

  // Get all Lucide icon names (only when needed)
  const allLucideNames = React.useMemo(() => {
    if (!searchQuery) return Object.values(genericCategories).flat();
    // Only load all icons when searching
    if (lucideIcons) {
      return Object.keys(lucideIcons).filter(
        (key) => key !== "createLucideIcon" && key !== "default"
      );
    }
    return [];
  }, [searchQuery, lucideIcons]);

  // Filter icons based on search
  const filteredIcons = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      // Don't filter when no search - show categorized icons
      return [];
    }
    
    const results: string[] = [];
    
    // Search brands
    allBrandNames.forEach((brandName) => {
      const cleanName = brandName.replace("brand:", "").toLowerCase();
      if (cleanName.includes(query)) {
        results.push(brandName);
      }
    });
    
    // Search Lucide icons (only when icons are loaded)
    if (lucideIcons) {
      allLucideNames.forEach((name) => {
        if (name.toLowerCase().includes(query)) {
          results.push(name);
        }
      });
    }
    
    return results.slice(0, 80); // Limit results
  }, [searchQuery, allBrandNames, allLucideNames, lucideIcons]);

  // Get selected icon component
  const SelectedIcon = React.useMemo(() => {
    if (!value || !lucideIcons || !simpleIcons) return null;
    
    if (value.startsWith("brand:")) {
      const brandName = value.replace("brand:", "");
      const pascalName = "Si" + brandName.charAt(0).toUpperCase() + brandName.slice(1)
        .replace("dotjs", "Dotjs")
        .replace("dotnet", "Dotnet")
        .replace("plusplus", "Plusplus");
      return simpleIcons[pascalName];
    }
    
    return lucideIcons[value];
  }, [value, lucideIcons, simpleIcons]);

  const handleSelect = React.useCallback((iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearchQuery("");
  }, [onChange]);

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
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search: html, python, excel, figma..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-[450px]">
              <CommandEmpty>No icon found.</CommandEmpty>
              
              {!searchQuery ? (
                <>
                  {/* Brand Logos */}
                  {Object.entries(brandCategories).map(([categoryName, icons]) => (
                    <CommandGroup key={categoryName} heading={categoryName}>
                      <div className="grid grid-cols-8 gap-1 p-2">
                        {icons.map((iconName) => {
                          const brandFullName = `brand:${iconName}`;
                          const pascalName = "Si" + iconName.charAt(0).toUpperCase() + iconName.slice(1)
                            .replace("dotjs", "Dotjs")
                            .replace("dotnet", "Dotnet")
                            .replace("plusplus", "Plusplus");
                          const Icon = simpleIcons?.[pascalName];
                          if (!Icon) return null;
                          
                          return (
                            <button
                              key={iconName}
                              onClick={() => handleSelect(brandFullName)}
                              className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent transition-colors",
                                value === brandFullName && "bg-accent"
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
                  ))}
                  
                  {/* Lucide Icons */}
                  {Object.entries(genericCategories).map(([categoryName, icons]) => (
                    <CommandGroup key={categoryName} heading={categoryName}>
                      <div className="grid grid-cols-8 gap-1 p-2">
                        {icons.map((iconName) => {
                          const Icon = lucideIcons?.[iconName];
                          if (!Icon) return null;
                          
                          return (
                            <button
                              key={iconName}
                              onClick={() => handleSelect(iconName)}
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
                  ))}
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
                        Icon = simpleIcons?.[pascalName];
                      } else {
                        Icon = lucideIcons?.[iconName];
                      }
                      
                      if (!Icon) return null;
                      
                      return (
                        <button
                          key={iconName}
                          onClick={() => handleSelect(iconName)}
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
        )}
      </PopoverContent>
    </Popover>
  );
});
