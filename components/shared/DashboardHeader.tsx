"use client";

import * as React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Bell, Shield } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CommandMenu } from "@/components/shared/CommandMenu";
import { DashboardBreadcrumb } from "@/components/shared/DashboardBreadcrumb";

export function DashboardHeader({ userRole }: { userRole?: string }) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 gap-4">
      {/* Left section: Sidebar trigger + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-5 bg-border hidden sm:block" />
        <DashboardBreadcrumb />
      </div>

      {/* Right section: Search (⌘K), Notifications, ThemeToggle, Clerk UserButton */}
      <div className="flex items-center gap-2.5">
        <CommandMenu />

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger
            className="inline-flex shrink-0 items-center justify-center relative rounded-xl border border-border bg-card h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 p-0 rounded-2xl border-border bg-popover/95 backdrop-blur-md shadow-lg"
          >
            <div className="p-3.5 border-b border-border flex items-center justify-between">
              <span className="font-bold text-xs">Notifications système</span>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md font-medium">
                Temps réel
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto p-2 space-y-1 text-xs">
              <div className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                <p className="font-semibold text-foreground">Système initialisé avec succès</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Base de données Neon PostgreSQL et authentification Clerk opérationnelles.
                </p>
                <span className="text-[10px] text-primary font-medium mt-1 block">
                  À l'instant
                </span>
              </div>
            </div>
            <div className="p-2 border-t border-border bg-muted/20 text-center">
              <Link
                href="/dashboard/notifications"
                className="text-[11px] font-semibold text-primary hover:underline block"
              >
                Voir toutes les notifications →
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        <Separator orientation="vertical" className="h-5 bg-border hidden sm:block" />

        {/* User Role Badge */}
        {userRole && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-muted/60 border border-border text-xs">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold capitalize text-foreground">{userRole}</span>
          </div>
        )}

        {/* Clerk User Button */}
        <div className="pl-1 flex items-center">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
