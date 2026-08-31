import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ShoppingBag, LayoutDashboard, UserCheck, ShieldCheck, ArrowRight, Package, Truck } from "lucide-react";
import { syncUserToDatabase } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const { userId } = await auth();

  if (userId) {
    await syncUserToDatabase();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              OmniStock <span className="text-indigo-400 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 ml-1">E-Commerce</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="text-white hover:text-indigo-400 transition-colors">Catalogue</Link>
            <Link href="/client" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-slate-400" />
              Espace Client
            </Link>
            <Link href="/dashboard" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4 text-slate-400" />
              Back-Office
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {userId ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/client"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  Mon Espace
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  Créer un compte <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-radial from-indigo-950/40 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="h-4 w-4" /> Solution ERP & E-Commerce Intégrée Next.js 15
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Plateforme E-Commerce & <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">Gestion de Stock Intelligente</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Gérez vos produits, mouvements de stock, commandes client, fournisseurs et réclamations dans une architecture synchronisée en temps réel.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/client"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" /> Accéder au Portail Client
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="h-5 w-5 text-indigo-400" /> Back-Office Gestionnaire
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-slate-900/40 border-t border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">E-Commerce & Commandes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Catalogue dynamique, panier client, tunnel de commande optimisé et historique des achats.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/40 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Gestion des Stocks multi-entrepôts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Suivi précis des mouvements de stock, alertes de seuils critiques, variantes produits & codes QR.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fournisseurs & Logistique</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Gestion des approvisionnements, retours, facturation achats/ventes et intégration transporteurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 bg-slate-950 text-slate-500 text-xs text-center">
        <p>© 2026 OmniStock System. Next.js 15, Drizzle ORM & Clerk Auth.</p>
      </footer>
    </div>
  );
}
