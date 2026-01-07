import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/* ═══════════════════════════════════════════════════════════════════════════
   TEXTAREA INTERACTION STATES — LOCKED
   
   Same interaction model as Input component.
   Hover: border darkens subtly (not focused)
   Focus: border emphasis, no ring glow
   Disabled: muted, opacity 50%
   Error: restrained red border only
   Transition: 150ms ease-out
   ═══════════════════════════════════════════════════════════════════════════ */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-muted/30 px-5 py-3 text-sm",
        "transition-[border-color] duration-150 ease-out",
        "placeholder:text-muted-foreground/60",
        "hover:border-muted-foreground/30",
        "focus:border-muted-foreground/50 focus:outline-none",
        "focus-visible:border-muted-foreground/50 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
        "aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:hover:border-destructive/60",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
