import * as React from "react";

import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   INPUT INTERACTION STATES — LOCKED
   
   Hover: border darkens subtly (not focused)
   Focus: border emphasis, no ring glow, high contrast
   Disabled: muted background, opacity 50%, cursor not-allowed
   Error: restrained red border only (no icons)
   Transition: 150ms ease-out
   ═══════════════════════════════════════════════════════════════════════════ */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-input bg-muted/30 px-5 py-2.5 text-sm",
          "transition-[border-color] duration-150 ease-out",
          "placeholder:text-muted-foreground/60",
          "hover:border-muted-foreground/30",
          "focus:border-muted-foreground/50 focus:outline-none",
          "focus-visible:border-muted-foreground/50 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:hover:border-destructive/60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
