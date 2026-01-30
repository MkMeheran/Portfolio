import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Writing } from "@/types/database.types";
import { cn } from "@/lib/utils";

interface WritingCardProps {
  writing: Writing;
  className?: string;
}

const typeColors = {
  academic: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  tech: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  literature: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
};

const typeLabels = {
  academic: "Academic",
  tech: "Technical",
  literature: "Literature",
};

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function estimateReadTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function WritingCard({ writing, className }: WritingCardProps) {
  return (
    <Card className={cn("group overflow-hidden transition-all hover:shadow-lg", className)}>
      {/* Cover Image */}
      {writing.cover_image && (
        <div className="relative aspect-[2/1] overflow-hidden bg-muted">
          <Image
            src={writing.cover_image}
            alt={writing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="space-y-2">
        {/* Type Badge */}
        <Badge variant="secondary" className={typeColors[writing.type]}>
          {typeLabels[writing.type]}
        </Badge>
        
        {/* Title */}
        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {writing.title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {writing.published_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(writing.published_at)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{estimateReadTime(writing.content)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Excerpt */}
        {writing.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {writing.excerpt}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {writing.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="ghost" className="w-full justify-between" asChild>
          <Link href={`/writings/${writing.slug}`}>
            Read More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
