import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-2 border-foreground/80 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-primary/90",
        destructive:
          "bg-red-500 text-white border-red-700 hover:bg-red-600",
        outline:
          "bg-background border-foreground/60 hover:bg-accent/50 hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary-foreground/30",
        ghost:
          "border-transparent shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-accent/50 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline border-transparent shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0",
        // Colorful CTA variants for neu-brutalism
        cta: "bg-amber-600 text-stone-950 border-amber-800 hover:bg-amber-700",
        "cta-green": "bg-emerald-700 text-white border-emerald-900 hover:bg-emerald-800",
        "cta-blue": "bg-sky-700 text-white border-sky-900 hover:bg-sky-800",
        "cta-pink": "bg-pink-700 text-white border-pink-900 hover:bg-pink-800",
        "cta-orange": "bg-orange-700 text-white border-orange-900 hover:bg-orange-800",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-3.5",
        xs: "h-7 gap-1 rounded-md px-2.5 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-md gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-11 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-10",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-md",
        "icon-lg": "size-11 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
