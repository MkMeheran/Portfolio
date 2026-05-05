"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

interface CarouselItem {
  id: string;
  text: string;
  icon?: string;
  color?: string;
}

interface InfiniteCarouselProps {
  items: CarouselItem[];
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteCarousel({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: InfiniteCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  const [lucideIcons, setLucideIcons] = useState<Record<string, any> | null>(null);
  const [simpleIcons, setSimpleIcons] = useState<Record<string, any> | null>(null);

  const needsBrandIcons = useMemo(
    () => items.some((item) => item.icon?.startsWith("brand:")),
    [items]
  );

  const needsLucideIcons = useMemo(
    () =>
      items.some((item) => {
        const icon = item.icon?.trim();
        if (!icon) return false;
        if (icon.startsWith("brand:")) return false;
        if (/[\u0080-\uFFFF]/.test(icon)) return false;
        return /^[A-Za-z][A-Za-z0-9]+$/.test(icon);
      }),
    [items]
  );

  useEffect(() => {
    if (scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      
      // Duplicate items for infinite effect
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      });

      setStart(true);
    }
  }, []);

  useEffect(() => {
    let active = true;

    if (needsLucideIcons && !lucideIcons) {
      import("lucide-react").then((mod) => {
        if (active) setLucideIcons(mod as Record<string, any>);
      });
    }

    if (needsBrandIcons && !simpleIcons) {
      import("@icons-pack/react-simple-icons").then((mod) => {
        if (active) setSimpleIcons(mod as Record<string, any>);
      });
    }

    return () => {
      active = false;
    };
  }, [needsBrandIcons, needsLucideIcons, lucideIcons, simpleIcons]);

  const speedMap = {
    slow: "60s",
    normal: "40s",
    fast: "20s",
  };

  return (
    <div
      className={cn(
        "scroller relative z-20 max-w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-2 py-2",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animationDuration: speedMap[speed],
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {items.map((item) => {
          const iconValue = item.icon?.trim();
          const isEmoji = Boolean(iconValue && /[\u0080-\uFFFF]/.test(iconValue));
          const isBrandIcon = Boolean(iconValue && iconValue.startsWith("brand:"));

          let IconComponent: any = null;

          if (iconValue && isBrandIcon && simpleIcons) {
            const brandName = iconValue.replace("brand:", "");
            const pascalName = "Si" + brandName.charAt(0).toUpperCase() + brandName.slice(1)
              .replace("dotjs", "Dotjs")
              .replace("dotnet", "Dotnet")
              .replace("plusplus", "Plusplus");
            IconComponent = simpleIcons[pascalName] || null;
          }

          if (iconValue && !IconComponent && !isBrandIcon && !isEmoji && lucideIcons) {
            IconComponent = lucideIcons[iconValue] || null;
          }

          const iconNode = IconComponent
            ? <IconComponent className="h-4 w-4" />
            : isEmoji
              ? <span className="text-base leading-none">{iconValue}</span>
              : null;

          return (
            <div
              key={item.id}
              className={cn(
                "relative shrink-0 border-2 border-stone-900 px-3 py-1.5",
                "bg-card shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]",
                "text-sm font-bold whitespace-nowrap flex items-center gap-1.5 font-[family-name:var(--font-space)]",
                "hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-default",
                item.color || "text-stone-800"
              )}
            >
              {iconNode}
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Multi-line carousel wrapper
interface MultiCarouselProps {
  line1: CarouselItem[];
  line2: CarouselItem[];
  className?: string;
}

export function MultiCarousel({ line1, line2, className }: MultiCarouselProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <InfiniteCarousel items={line1} direction="left" speed="normal" />
      <InfiniteCarousel items={line2} direction="right" speed="slow" />
    </div>
  );
}
