import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FORM FEEDBACK — INSTITUTIONAL STANDARD (LOCKED)
 * 
 * Provides subtle, accessible feedback for form submissions.
 * Uses neutral palette with semantic tokens — no bright colors.
 */

interface FormFeedbackProps {
  type: "success" | "error";
  title: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function FormFeedback({ 
  type, 
  title, 
  message, 
  onDismiss,
  className 
}: FormFeedbackProps) {
  const isSuccess = type === "success";
  
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "relative p-4 rounded-md border transition-all duration-200",
        isSuccess 
          ? "bg-[#f8f9fa] border-[#d4d4d4] text-foreground" 
          : "bg-[#fef2f2] border-[#fca5a5] text-foreground",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <CheckCircle2 
            size={18} 
            className="text-foreground/70 mt-0.5 flex-shrink-0" 
            aria-hidden="true"
          />
        ) : (
          <AlertCircle 
            size={18} 
            className="text-[#dc2626] mt-0.5 flex-shrink-0" 
            aria-hidden="true"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-foreground mb-0.5">
            {title}
          </p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 -mt-1"
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}