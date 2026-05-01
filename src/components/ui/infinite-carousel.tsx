"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

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
          const hasIcon = Boolean(item.icon?.trim());
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
              {hasIcon && (
                <span className="text-base leading-none">{item.icon}</span>
              )}
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
