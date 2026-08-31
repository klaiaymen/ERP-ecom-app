import * as React from "react";
import Link from "next/link";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title = "Aucune donnée trouvée",
  description = "Il n'y a aucun élément correspondant à vos critères pour le moment.",
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  actionHref,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-border bg-card/50",
        className
      )}
    >
      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 shadow-sm">
        <Icon className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        <>
          {actionHref ? (
            <Button
              render={<Link href={actionHref} />}
              className="rounded-xl shadow-sm"
            >
              {actionLabel}
            </Button>
          ) : (
            <Button onClick={onAction} className="rounded-xl shadow-sm">
              {actionLabel}
            </Button>
          )}
        </>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
