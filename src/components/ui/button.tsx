import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-body font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] min-h-[44px] min-w-[44px] gradeaid-button-shadow",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-primary text-primary-foreground border-l-[10px] border-b-[10px] border-foreground uppercase tracking-wide font-bold",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground border-l-[10px] border-b-[10px] border-foreground uppercase tracking-wide font-bold",
        accent:
          "rounded-full bg-accent text-accent-foreground border-l-[10px] border-b-[10px] border-foreground uppercase tracking-wide font-bold",
        outline:
          "rounded-[10px] border border-border bg-background hover:bg-muted",
        ghost: "rounded-[10px] hover:bg-muted",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-xl",
        sm: "h-10 px-4 py-2 text-lg",
        lg: "h-14 px-8 py-4 text-2xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
