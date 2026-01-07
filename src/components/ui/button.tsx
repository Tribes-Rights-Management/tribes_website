import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTON INTERACTION STATES — LOCKED
   
   Hover: subtle brightness shift (94% for filled, slight bg for outline)
   Focus: 1px solid ring, 2px offset, neutral color
   Active: instant opacity reduction (85%)
   Disabled: opacity 50%, cursor not-allowed, no events
   Transition: 150ms ease-out
   
   PROHIBITIONS: No scale, bounce, shadow animation, or color hierarchy shifts
   ═══════════════════════════════════════════════════════════════════════════ */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[filter,opacity,background-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:opacity-85",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-[1.06] rounded-md",
        destructive: "bg-destructive text-destructive-foreground hover:brightness-[0.94] rounded-md",
        outline: "border border-input bg-background hover:bg-accent/50 rounded-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70 rounded-md",
        ghost: "hover:bg-accent/50 rounded-md",
        link: "text-primary underline underline-offset-2 decoration-transparent hover:decoration-current",
        pill: "bg-primary text-primary-foreground hover:brightness-[1.06] rounded-full",
        "pill-outline": "border border-input bg-background hover:bg-accent/50 rounded-full",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        sm: "h-9 px-3 py-2",
        lg: "h-11 px-6 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
