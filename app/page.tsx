import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ShoppingBag,
  LayoutDashboard,
  UserCheck,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { syncUserToDatabase } from "@/lib/auth";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CartSheet } from "@/components/shared/CartSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const { userId } = await auth();

  if (userId) {
    await syncUserToDatabase();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Header / Navbar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                <Package className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                OmniStock <span className="text-primary text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 ml-1">Store</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-muted-foreground">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Catalogue
              </Link>
              <Link href="/client" className="hover:text-foreground transition-colors flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5" />
                Espace Client
              </Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Back-Office ERP
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <CartSheet />
            <ThemeToggle />

            {userId ? (
              <div className="flex items-center gap-2.5 pl-1">
                <Button render={<Link href="/client" />} size="sm" variant="outline" className="hidden sm:inline-flex rounded-xl text-xs h-9">
                  Mon Espace
                </Button>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button render={<Link href="/sign-in" />} variant="ghost" size="sm" className="rounded-xl text-xs h-9">
                  Connexion
                </Button>
                <Button render={<Link href="/sign-up" />} size="sm" className="rounded-xl text-xs h-9 shadow-sm shadow-primary/20">
                  <span>Créer un compte</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32 border-b border-border bg-radial from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Solution E-Commerce & Stock Unifiée Next.js 15
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.1]">
            L'ERP E-Commerce <br />
            <span className="text-primary bg-clip-text">conçu pour la performance</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Synchronisez vos catalogues produits, stocks multi-entrepôts, commandes clients, factures et réclamations dans une interface fluide et instantanée.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Button render={<Link href="/client" />} size="lg" className="w-full sm:w-auto rounded-xl font-bold shadow-lg shadow-primary/25 h-11 px-6">
              <ShoppingBag className="h-4 w-4 mr-2" /> Explorer la boutique
            </Button>
            <Button render={<Link href="/dashboard" />} variant="outline" size="lg" className="w-full sm:w-auto rounded-xl font-semibold h-11 px-6 border-border">
              <LayoutDashboard className="h-4 w-4 mr-2 text-primary" /> Back-Office Gestionnaire
            </Button>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground">Une architecture complète pensée pour l'échelle</h2>
            <p className="text-xs text-muted-foreground mt-1">4 niveaux de permissions sécurisés par Clerk & Drizzle ORM</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">E-Commerce & Commandes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Catalogue avec variantes dynamiques, tunnel de commande, gestion des remises et suivi d'expédition.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Gestion des Stocks & Mouvements</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Traçabilité complète des entrées/sorties, gestion des seuils d'alerte, codes QR et inventaires.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Fournisseurs & Facturation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Achats fournisseurs, gestion des dettes, facturation automatisée et intégration transporteurs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border bg-card text-muted-foreground text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 OmniStock System. Next.js 15, Drizzle ORM, Tailwind CSS & Clerk Auth.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">Boutique</Link>
            <Link href="/client" className="hover:text-foreground transition-colors">Espace Client</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
