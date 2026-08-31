import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusCategory =
  | "order"
  | "claim"
  | "invoice"
  | "delivery"
  | "stock"
  | "return"
  | "user"
  | "generic";

interface StatusConfig {
  label: string;
  className: string;
  dotColor: string;
}

const statusMap: Record<string, StatusConfig> = {
  // Order statuses
  pending: { label: "En attente", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", dotColor: "bg-amber-500" },
  confirmed: { label: "Confirmée", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", dotColor: "bg-blue-500" },
  processing: { label: "En préparation", className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20", dotColor: "bg-indigo-500" },
  shipped: { label: "Expédiée", className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", dotColor: "bg-purple-500" },
  delivered: { label: "Livrée", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dotColor: "bg-emerald-500" },
  cancelled: { label: "Annulée", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", dotColor: "bg-rose-500" },
  refunded: { label: "Remboursée", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20", dotColor: "bg-slate-500" },

  // Claims & Returns
  in_review: { label: "En examen", className: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20", dotColor: "bg-cyan-500" },
  approved: { label: "Approuvée", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dotColor: "bg-emerald-500" },
  rejected: { label: "Rejetée", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", dotColor: "bg-rose-500" },
  resolved: { label: "Résolue", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dotColor: "bg-emerald-500" },
  requested: { label: "Demandé", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", dotColor: "bg-amber-500" },
  received: { label: "Reçu", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", dotColor: "bg-blue-500" },
  inspected: { label: "Inspecté", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20", dotColor: "bg-violet-500" },

  // Invoices
  draft: { label: "Brouillon", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20", dotColor: "bg-slate-400" },
  unpaid: { label: "Impayée", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", dotColor: "bg-amber-500" },
  paid: { label: "Payée", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dotColor: "bg-emerald-500" },
  overdue: { label: "En retard", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", dotColor: "bg-rose-500" },

  // Stock
  in_stock: { label: "En stock", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dotColor: "bg-emerald-500" },
  low_stock: { label: "Stock faible", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", dotColor: "bg-amber-500" },
  out_of_stock: { label: "Rupture de stock", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", dotColor: "bg-rose-500" },

  // Roles
  admin: { label: "Administrateur", className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", dotColor: "bg-purple-500" },
  commercial: { label: "Commercial", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", dotColor: "bg-blue-500" },
  client: { label: "Client", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dotColor: "bg-emerald-500" },

  // Generic
  active: { label: "Actif", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dotColor: "bg-emerald-500" },
  inactive: { label: "Inactif", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20", dotColor: "bg-slate-400" },
};

export function StatusBadge({
  status,
  customLabel,
  className,
}: {
  status: string;
  customLabel?: string;
  className?: string;
}) {
  const normalizedStatus = status.toLowerCase();
  const config = statusMap[normalizedStatus] || {
    label: customLabel || status,
    className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    dotColor: "bg-slate-400",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
        config.className,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      <span>{customLabel || config.label}</span>
    </Badge>
  );
}
