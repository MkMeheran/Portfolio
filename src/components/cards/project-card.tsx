import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/database.types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const categoryColors = {
  gis: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  web: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  ai: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const categoryLabels = {
  gis: "GIS & Mapping",
  web: "Web Development",
  ai: "AI & Automation",
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Card className={cn("group overflow-hidden transition-all hover:shadow-lg", className)}>
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <span className="text-4xl font-bold text-primary/20">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {project.featured && (
          <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}
      </div>

      <CardHeader className="space-y-2">
        {/* Category Badge */}
        <Badge variant="secondary" className={categoryColors[project.category]}>
          {categoryLabels[project.category]}
        </Badge>
        
        {/* Title */}
        <h3 className="text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.tech_stack.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.tech_stack.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="default" size="sm" className="flex-1" asChild>
          <Link href={`/projects/${project.slug}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        
        {project.demo_link && (
          <Button variant="outline" size="icon" asChild>
            <Link href={project.demo_link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Live Demo</span>
            </Link>
          </Button>
        )}
        
        {project.repo_link && (
          <Button variant="outline" size="icon" asChild>
            <Link href={project.repo_link} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">Source Code</span>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
