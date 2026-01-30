import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border border-foreground/20 px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-primary/80 [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary-foreground/20 [a&]:hover:bg-secondary/90",
        destructive:
          "bg-red-500 text-white border-red-700 [a&]:hover:bg-red-600",
        outline:
          "border-foreground/30 bg-background text-foreground [a&]:hover:bg-accent/50",
        ghost: "border-transparent shadow-none [a&]:hover:bg-accent/50 [a&]:hover:text-accent-foreground",
        link: "text-primary border-transparent shadow-none underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
