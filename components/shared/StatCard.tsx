import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  change?: {
    value: number;
    timeframe?: string;
  };
  iconClassName?: string;
  iconBgClassName?: string;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  change,
  iconClassName,
  iconBgClassName,
  loading = false,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn("rounded-2xl border-border bg-card shadow-sm p-6 space-y-3", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-36 rounded-md" />
        <Skeleton className="h-3 w-20 rounded-md" />
      </Card>
    );
  }

  const isPositive = change && change.value >= 0;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border-border bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
              iconBgClassName || "bg-primary/10",
              iconClassName || "text-primary"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-xs">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md",
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? "+" : ""}
                {change.value}%
              </span>
            )}

            {(description || change?.timeframe) && (
              <span className="text-muted-foreground truncate">
                {description || change?.timeframe}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
