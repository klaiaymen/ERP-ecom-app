"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
}: {
  className?: string;
}) {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-xl border border-border bg-card h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer",
          className
        )}
        aria-label="Changer de thème"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
        <span className="sr-only">Changer de thème</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-border bg-popover/95 backdrop-blur-md">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer text-xs font-medium"
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Clair</span>
          {theme === "light" && <span className="ml-auto text-primary font-bold">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer text-xs font-medium"
        >
          <Moon className="h-4 w-4 text-indigo-400" />
          <span>Sombre</span>
          {theme === "dark" && <span className="ml-auto text-primary font-bold">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer text-xs font-medium"
        >
          <Laptop className="h-4 w-4 text-muted-foreground" />
          <span>Système</span>
          {theme === "system" && <span className="ml-auto text-primary font-bold">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
