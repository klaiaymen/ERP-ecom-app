"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Package,
  Layers,
  Building2,
  ShoppingCart,
  RotateCcw,
  Users,
  BarChart3,
  Bell,
  MessageSquareWarning,
  FileCheck,
  Truck,
  Tag,
  Sun,
  Moon,
  Laptop,
  Search,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center justify-between w-full max-w-[280px] h-9 px-3 text-xs text-muted-foreground bg-muted/50 hover:bg-muted rounded-xl border border-border transition-colors group"
      >
        <span className="inline-flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="hidden sm:inline">Recherche rapide...</span>
          <span className="sm:hidden">Recherche...</span>
        </span>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tapez une commande ou recherchez..." />
        <CommandList className="max-h-[350px]">
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          
          <CommandGroup heading="Catalogue & Stocks">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/produits"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Package className="h-4 w-4 text-blue-500" />
              <span>Produits & Variantes</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/stocks"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Layers className="h-4 w-4 text-emerald-500" />
              <span>Stocks & Mouvements</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Ventes & Logistique">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/commandes"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4 text-amber-500" />
              <span>Commandes Clients</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/retours"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 text-rose-500" />
              <span>Retours</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/factures"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="h-4 w-4 text-sky-500" />
              <span>Factures Ventes / Achats</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/transporteurs"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Truck className="h-4 w-4 text-violet-500" />
              <span>Transporteurs & Livraisons</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Fournisseurs & Finance">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/fournisseurs"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="h-4 w-4 text-purple-500" />
              <span>Fournisseurs & Contacts</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/finance-fournisseurs"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="h-4 w-4 text-teal-500" />
              <span>Finance Fournisseurs</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Administration & Support">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/utilisateurs"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Users className="h-4 w-4 text-cyan-500" />
              <span>Utilisateurs & Rôles (Admin)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/reporting"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <span>Reporting & KPIs</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/reclamations"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <MessageSquareWarning className="h-4 w-4 text-orange-500" />
              <span>Réclamations Support</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/marketing"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Tag className="h-4 w-4 text-pink-500" />
              <span>Marketing & Codes Promo</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard/notifications"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Bell className="h-4 w-4 text-yellow-500" />
              <span>Centre de notifications</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Thème d'affichage">
            <CommandItem
              onSelect={() => runCommand(() => setTheme("light"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Mode Clair</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme("dark"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Moon className="h-4 w-4 text-indigo-400" />
              <span>Mode Sombre</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme("system"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Laptop className="h-4 w-4 text-muted-foreground" />
              <span>Thème Système</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
