import { ReactNode } from "react";

interface DetailSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DetailSection({ title, children, className = "" }: DetailSectionProps) {
  return (
    <section className={className}>
      <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3">
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </section>
  );
}

interface DetailRowProps {
  label: string;
  value?: string | null;
  children?: ReactNode;
}

export function DetailRow({ label, value, children }: DetailRowProps) {
  if (!value && !children) return null;
  return (
    <div className="flex justify-between gap-4 text-sm py-0.5">
      <span className="text-muted-foreground shrink-0">{label}</span>
      {children || <span className="text-right truncate">{value}</span>}
    </div>
  );
}

interface DetailBlockProps {
  children: ReactNode;
}

export function DetailBlock({ children }: DetailBlockProps) {
  return (
    <div className="text-sm text-foreground leading-relaxed">
      {children}
    </div>
  );
}
