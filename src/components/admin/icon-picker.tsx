"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X, Check } from "lucide-react";
import { iconRegistry, iconCategories, type IconName } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allIconNames = useMemo(() => Object.keys(iconRegistry), []);
  
  const filteredIcons = useMemo(() => {
    let icons = allIconNames;
    
    // Filter by category
    if (selectedCategory) {
      const categoryIcons = iconCategories[selectedCategory as keyof typeof iconCategories] || [];
      icons = icons.filter((name) => categoryIcons.includes(name));
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      icons = icons.filter((name) => name.toLowerCase().includes(query));
    }
    
    return icons;
  }, [allIconNames, selectedCategory, searchQuery]);

  const handleSelect = useCallback((iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery("");
  }, [onChange]);

  const SelectedIcon = value ? iconRegistry[value as IconName] : null;

  return (
    <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start gap-2 border-2 border-stone-300 hover:border-stone-400"
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon className="h-4 w-4" />
            <span className="text-sm">{value}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select an icon...</span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[320px] bg-white border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] rounded-none">
          {/* Header */}
          <div className="p-3 border-b-2 border-stone-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 border-stone-300"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="h-6 px-2 text-[10px]"
              >
                All
              </Button>
              {Object.keys(iconCategories).map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="h-6 px-2 text-[10px]"
                >
                  {category.split(" ")[0]}
                </Button>
              ))}
            </div>
          </div>

          {/* Icons Grid */}
          <div className="h-[280px] overflow-y-auto">
            <div className="p-3">
              {filteredIcons.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No icons found
                </p>
              ) : (
                <div className="grid grid-cols-6 gap-1">
                  {filteredIcons.map((iconName) => {
                    const Icon = iconRegistry[iconName as IconName];
                    const isSelected = value === iconName;
                    
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleSelect(iconName)}
                        title={iconName}
                        className={cn(
                          "relative flex items-center justify-center p-2 rounded-sm border transition-all",
                          isSelected
                            ? "bg-amber-100 border-amber-500 text-amber-700"
                            : "bg-white border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                            <Check className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-2 border-t-2 border-stone-200 bg-stone-50">
            <p className="text-[10px] text-center text-muted-foreground">
              {filteredIcons.length} icons available
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline icon picker for forms (shows icon in a grid directly)
interface IconPickerInlineProps {
  value?: string;
  onChange: (iconName: string) => void;
  maxDisplay?: number;
  className?: string;
}

export function IconPickerInline({ 
  value, 
  onChange, 
  maxDisplay = 24,
  className 
}: IconPickerInlineProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const allIconNames = useMemo(() => Object.keys(iconRegistry), []);
  
  const filteredIcons = useMemo(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return allIconNames.filter((name) => name.toLowerCase().includes(query));
    }
    return allIconNames;
  }, [allIconNames, searchQuery]);

  const displayedIcons = showAll ? filteredIcons : filteredIcons.slice(0, maxDisplay);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <Input
          placeholder="Search icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-9 border-stone-300"
        />
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-8 sm:grid-cols-12 gap-1">
        {displayedIcons.map((iconName) => {
          const Icon = iconRegistry[iconName as IconName];
          const isSelected = value === iconName;
          
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              title={iconName}
              className={cn(
                "relative flex items-center justify-center p-2 rounded-sm border-2 transition-all",
                isSelected
                  ? "bg-amber-100 border-amber-500 text-amber-700 shadow-[2px_2px_0px_0px_#fbbf24]"
                  : "bg-white border-stone-200 hover:border-stone-400 hover:bg-stone-50"
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      {/* Show More/Less */}
      {filteredIcons.length > maxDisplay && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full text-xs"
        >
          {showAll ? "Show Less" : `Show All (${filteredIcons.length})`}
        </Button>
      )}

      {/* Selected Display */}
      {value && (
        <div className="flex items-center gap-2 p-2 bg-stone-50 border-2 border-stone-200 rounded-sm">
          {iconRegistry[value as IconName] && (
            <>
              {(() => {
                const Icon = iconRegistry[value as IconName];
                return <Icon className="h-5 w-5 text-amber-600" />;
              })()}
              <span className="text-sm font-medium">{value}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
