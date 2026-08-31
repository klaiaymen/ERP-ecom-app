"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Layers,
  ShoppingCart,
  RotateCcw,
  FileCheck,
  Building2,
  Truck,
  MessageSquareWarning,
  Tag,
  Bell,
  Users,
  BarChart3,
  Store,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Catalogue & Stocks",
    items: [
      { title: "Produits & Variantes", url: "/dashboard/produits", icon: Package },
      { title: "Stocks & Mouvements", url: "/dashboard/stocks", icon: Layers },
    ],
  },
  {
    label: "Ventes & Commandes",
    items: [
      { title: "Commandes", url: "/dashboard/commandes", icon: ShoppingCart },
      { title: "Retours", url: "/dashboard/retours", icon: RotateCcw },
      { title: "Factures Ventes / Achats", url: "/dashboard/factures", icon: FileCheck },
    ],
  },
  {
    label: "Achats & Logistique",
    items: [
      { title: "Fournisseurs", url: "/dashboard/fournisseurs", icon: Building2 },
      { title: "Finance Fournisseurs", url: "/dashboard/finance-fournisseurs", icon: Building2 },
      { title: "Transporteurs", url: "/dashboard/transporteurs", icon: Truck },
    ],
  },
  {
    label: "Support & Marketing",
    items: [
      { title: "Réclamations", url: "/dashboard/reclamations", icon: MessageSquareWarning },
      { title: "Marketing & Promos", url: "/dashboard/marketing", icon: Tag },
      { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Utilisateurs (Admin)", url: "/dashboard/utilisateurs", icon: Users, adminOnly: true },
      { title: "Reporting & KPIs", url: "/dashboard/reporting", icon: BarChart3 },
    ],
  },
];

export function DashboardSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* Brand Header */}
      <SidebarHeader className="h-16 flex items-center justify-between border-b border-sidebar-border px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-extrabold text-sm tracking-tight text-sidebar-foreground">
              OmniStock <span className="text-primary text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 ml-1">ERP</span>
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">Gestion Intégrée</span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Main Nav Content */}
      <SidebarContent className="px-2 py-4 space-y-6">
        {/* Main Dashboard Link */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard" />}
              isActive={pathname === "/dashboard"}
              tooltip="Vue d'ensemble"
              className={cn(
                "rounded-xl h-10 font-semibold text-xs transition-all",
                pathname === "/dashboard"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              )}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Tableau de bord</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {navSections.map((section) => {
          // Filter admin-only items if user is not admin
          const visibleItems = section.items.filter(
            (item) => !item.adminOnly || userRole === "admin"
          );

          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={section.label} className="p-0">
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2 mb-1">
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          render={<Link href={item.url} />}
                          isActive={isActive}
                          tooltip={item.title}
                          className={cn(
                            "rounded-xl h-9 text-xs font-medium transition-all group/item flex items-center justify-between",
                            isActive
                              ? "bg-primary/10 text-primary font-bold hover:bg-primary/15 border border-primary/20"
                              : "hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={cn(
                                "h-4 w-4 shrink-0 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground group-hover/item:text-sidebar-foreground"
                              )}
                            />
                            <span className="truncate">{item.title}</span>
                          </div>
                          {item.adminOnly && (
                            <span className="hidden group-data-[collapsible=icon]:hidden text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                              Admin
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Accéder à la boutique publique"
              className="rounded-xl h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 shrink-0" />
                <span>Boutique Publique</span>
              </div>
              <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
