import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
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
} from "lucide-react";

export const dynamic = "force-dynamic";

const dashboardModules = [
  { name: "Produits", href: "/dashboard/produits", icon: Package, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "Stocks & Mouvements", href: "/dashboard/stocks", icon: Layers, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { name: "Fournisseurs", href: "/dashboard/fournisseurs", icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10" },
  { name: "Commandes", href: "/dashboard/commandes", icon: ShoppingCart, color: "text-amber-400", bg: "bg-amber-500/10" },
  { name: "Retours", href: "/dashboard/retours", icon: RotateCcw, color: "text-rose-400", bg: "bg-rose-500/10" },
  { name: "Utilisateurs (Admin)", href: "/dashboard/utilisateurs", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10", adminOnly: true },
  { name: "Reporting & KPIs", href: "/dashboard/reporting", icon: BarChart3, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { name: "Réclamations", href: "/dashboard/reclamations", icon: MessageSquareWarning, color: "text-orange-400", bg: "bg-orange-500/10" },
  { name: "Finance Fournisseurs", href: "/dashboard/finance-fournisseurs", icon: Building2, color: "text-teal-400", bg: "bg-teal-500/10" },
  { name: "Factures", href: "/dashboard/factures", icon: FileCheck, color: "text-sky-400", bg: "bg-sky-500/10" },
  { name: "Transporteurs", href: "/dashboard/transporteurs", icon: Truck, color: "text-violet-400", bg: "bg-violet-500/10" },
  { name: "Marketing & Promos", href: "/dashboard/marketing", icon: Tag, color: "text-pink-400", bg: "bg-pink-500/10" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Back-Office ERP</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Admin & Commercial
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">Tableau de Bord & Modules</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              ← Boutique
            </Link>
            <UserButton />
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {dashboardModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-11 w-11 rounded-xl ${module.bg} ${module.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {module.adminOnly && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Shield className="h-3 w-3" /> Admin
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                    {module.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Accéder au module →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
