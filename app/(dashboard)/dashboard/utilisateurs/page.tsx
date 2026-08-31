import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Users, ShieldCheck, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function UtilisateursAdminPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Module Administrateur</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-3">
              Gestion des Rôles & Accès Utilisateurs
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </h1>
          </div>
          <UserButton />
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center max-w-2xl mx-auto space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Module Réservé aux Administrateurs</h2>
          <p className="text-slate-400 text-sm">
            Ce module permet de gérer l'attribution des rôles (`admin`, `commercial`, `client`) dans Clerk et de superviser les permissions des utilisateurs de la plateforme.
          </p>
        </div>
      </div>
    </div>
  );
}
