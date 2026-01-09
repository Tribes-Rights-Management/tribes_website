import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // INSTITUTIONAL CHECKBOX (LOCKED)
      // Legal consent pattern: square, neutral border, NO solid fill when checked
      // Checked state shows checkmark only, background remains light
      "peer h-[18px] w-[18px] shrink-0 rounded-[2px] border border-[#d4d4d4] bg-white transition-colors duration-150 ease-out data-[state=checked]:border-[#525252] focus-visible:outline-none focus-visible:border-[#737373] disabled:cursor-not-allowed disabled:opacity-40",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-[#1a1a1a]")}>
      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
