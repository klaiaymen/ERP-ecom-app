import Link from "next/link";
import {
  Package,
  Layers,
  Users,
  ShoppingCart,
  RotateCcw,
  Shield,
  BarChart3,
  Bell,
  MessageSquareWarning,
  Building2,
  FileCheck,
  Truck,
  Tag,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const dashboardModules = [
  { name: "Produits", href: "/dashboard/produits", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Catalogue, variantes & prix" },
  { name: "Stocks & Mouvements", href: "/dashboard/stocks", icon: Layers, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Suivi en temps réel & seuils" },
  { name: "Commandes", href: "/dashboard/commandes", icon: ShoppingCart, color: "text-amber-500", bg: "bg-amber-500/10", desc: "Traitement des commandes client" },
  { name: "Retours", href: "/dashboard/retours", icon: RotateCcw, color: "text-rose-500", bg: "bg-rose-500/10", desc: "Gestion des RMA et remboursements" },
  { name: "Facturation", href: "/dashboard/factures", icon: FileCheck, color: "text-sky-500", bg: "bg-sky-500/10", desc: "Factures ventes & achats" },
  { name: "Fournisseurs", href: "/dashboard/fournisseurs", icon: Building2, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Carnet d'adresses & contacts" },
  { name: "Finance Fournisseurs", href: "/dashboard/finance-fournisseurs", icon: Building2, color: "text-teal-500", bg: "bg-teal-500/10", desc: "Suivi des dettes et règlements" },
  { name: "Transporteurs", href: "/dashboard/transporteurs", icon: Truck, color: "text-violet-500", bg: "bg-violet-500/10", desc: "Suivi des colis et logistique" },
  { name: "Réclamations", href: "/dashboard/reclamations", icon: MessageSquareWarning, color: "text-orange-500", bg: "bg-orange-500/10", desc: "Tickets et SAV client" },
  { name: "Marketing & Promos", href: "/dashboard/marketing", icon: Tag, color: "text-pink-500", bg: "bg-pink-500/10", desc: "Codes promotionnels & offres" },
  { name: "Reporting & KPIs", href: "/dashboard/reporting", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10", desc: "Analyses de ventes et marge" },
  { name: "Utilisateurs & Accès", href: "/dashboard/utilisateurs", icon: Users, color: "text-cyan-500", bg: "bg-cyan-500/10", desc: "Rôles Admin / Commercial / Client", adminOnly: true },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Vue d'ensemble
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Supervisez l'ensemble de votre activité e-commerce et flux de stock en temps réel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Chiffre d'affaires"
          value="48 920 €"
          icon={DollarSign}
          change={{ value: 12.5, timeframe: "vs mois dernier" }}
          iconBgClassName="bg-indigo-500/10"
          iconClassName="text-indigo-500"
        />
        <StatCard
          title="Commandes du mois"
          value="342"
          icon={ShoppingCart}
          change={{ value: 8.2, timeframe: "vs mois dernier" }}
          iconBgClassName="bg-blue-500/10"
          iconClassName="text-blue-500"
        />
        <StatCard
          title="Alertes Stock Faible"
          value="7"
          icon={AlertTriangle}
          change={{ value: -3.4, timeframe: "sur 150 variantes" }}
          iconBgClassName="bg-amber-500/10"
          iconClassName="text-amber-500"
        />
        <StatCard
          title="Réclamations en cours"
          value="3"
          icon={MessageSquareWarning}
          change={{ value: -25.0, timeframe: "délai moy: 4h" }}
          iconBgClassName="bg-orange-500/10"
          iconClassName="text-orange-500"
        />
      </div>

      {/* Modules Quick Access Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Modules Opérationnels</h2>
            <p className="text-xs text-muted-foreground">Accédez directement aux différents espaces de gestion.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dashboardModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group relative p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`h-10 w-10 rounded-xl ${mod.bg} ${mod.color} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {mod.adminOnly && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Admin
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    {mod.name}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
