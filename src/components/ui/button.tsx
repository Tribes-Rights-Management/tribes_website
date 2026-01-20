import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * INSTITUTIONAL BUTTON SYSTEM (LOCKED)
 * 
 * Design Philosophy:
 * - Institutional, not consumer
 * - Understated, not attention-seeking
 * - Monochromatic, not colorful
 * - Sparse, not dense
 * - Think: Financial terminal, not SaaS dashboard
 * 
 * Variants:
 * - default: Primary actions (Add, Save, Create) - white border on transparent
 * - secondary: Less important actions (Cancel, Back) - gray border
 * - ghost: Text-only actions (Edit, View) - no border, subtle hover
 * - link: Inline text links with underline hover
 * - destructive: Delete/Remove actions - red border
 * 
 * Context-aware theming:
 * - Dark context (default): White/gray borders and text
 * - Light context: Use outline variant for solid fills
 */
const buttonVariants = cva(
  // Base: institutional platform-grade button system
  // System-level, not CTA-driven. No bounce, spring, or decorative animation.
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[14px] font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none tracking-[0.01em]",
  {
    variants: {
      variant: {
        // Primary: Transparent with white border - main actions
        default:
          "bg-transparent border border-white text-white hover:bg-white/[0.08] active:bg-white/[0.12]",

        // Secondary: Gray border, muted text - less important actions
        secondary:
          "bg-transparent border border-[#303030] text-[#AAAAAA] font-normal hover:border-[#505050] hover:text-white active:bg-white/[0.05]",

        // Ghost/Text: No border, subtle hover - inline actions
        ghost:
          "bg-transparent border-none text-[#AAAAAA] font-normal hover:text-white hover:underline hover:underline-offset-4 active:opacity-80",

        // Link: Underline style
        link: "bg-transparent border-none text-[#AAAAAA] underline-offset-4 hover:text-white hover:underline",

        // Destructive: Red border - delete/remove actions
        destructive:
          "bg-transparent border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626]/10 active:bg-[#DC2626]/15",

        // Outline: For light backgrounds - solid fill style
        outline:
          "bg-foreground text-white border border-foreground hover:opacity-90 active:opacity-80",
      },
      size: {
        // Institutional sizing with generous padding
        default: "h-11 px-5 py-2.5 rounded-md",
        sm: "h-9 px-4 py-2 rounded-md text-[13px]",
        lg: "h-12 px-6 py-3 rounded-md",
        icon: "h-9 w-9 rounded-md",
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
