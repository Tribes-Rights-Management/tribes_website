import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: institutional platform-grade button system (LOCKED)
  // System-level, not CTA-driven. No bounce, spring, or decorative animation.
  // Opacity transitions only. No scale transforms.
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[14px] font-medium transition-opacity duration-[120ms] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-1 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:opacity-75 select-none",
  {
    variants: {
      variant: {
        // Primary: solid black, white text, no emphasis inflation (LOCKED)
        default: "bg-foreground text-white hover:opacity-90 disabled:bg-[#a3a3a3] disabled:opacity-100",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        outline: "border border-[#d4d4d4] bg-white text-foreground hover:bg-[#fafafa]",
        secondary: "bg-[#f5f5f5] text-foreground hover:bg-[#e5e5e5]",
        ghost: "hover:bg-[#f5f5f5] text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        // Reduced heights for system-level feel (LOCKED)
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3.5 text-[13px]",
        lg: "h-12 rounded-md px-6",
        icon: "h-9 w-9",
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
