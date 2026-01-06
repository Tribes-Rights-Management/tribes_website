interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
