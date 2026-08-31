import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ShoppingBag, LifeBuoy, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ClientDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Espace Client Connecté</span>
            <h1 className="text-3xl font-extrabold text-white">Mon Compte & Mes Commandes</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              ← Retour à la boutique
            </Link>
            <UserButton />
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Mes Commandes</h3>
            <p className="text-slate-400 text-sm mt-1">Consultez l'historique et l'état de livraison de vos achats.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/40 transition-all">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Mes Réclamations</h3>
            <p className="text-slate-400 text-sm mt-1">Soumettez ou suivez une demande de support / réclamation.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Mon Profil</h3>
            <p className="text-slate-400 text-sm mt-1">Gérez vos coordonnées de livraison et vos informations personnelles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
