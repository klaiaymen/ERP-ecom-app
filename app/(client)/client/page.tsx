import Link from "next/link";
import {
  ShoppingBag,
  LifeBuoy,
  User,
  Package,
  RotateCcw,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function ClientDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Mon Espace Client
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Suivez vos commandes, effectuez une réclamation ou gérez vos informations.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Commandes Passées"
          value="4"
          icon={ShoppingBag}
          description="Total cumulé"
          iconBgClassName="bg-blue-500/10"
          iconClassName="text-blue-500"
        />
        <StatCard
          title="Livraisons en cours"
          value="1"
          icon={Package}
          description="Arrivée estimée demain"
          iconBgClassName="bg-amber-500/10"
          iconClassName="text-amber-500"
        />
        <StatCard
          title="Réclamations"
          value="0"
          icon={LifeBuoy}
          description="Aucun litige actif"
          iconBgClassName="bg-emerald-500/10"
          iconClassName="text-emerald-500"
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-md transition-all">
          <CardContent className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Mes Commandes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Consultez l'historique détaillé de vos achats, factures de vente et numéros de suivi colis.
            </p>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/" />}
              className="rounded-xl text-xs mt-2 w-full"
            >
              Commander à nouveau
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-md transition-all">
          <CardContent className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Retours & Réclamations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Un problème avec un article reçu ? Ouvrez une demande de retour ou signalez une réclamation.
            </p>
            <Button variant="outline" size="sm" className="rounded-xl text-xs mt-2 w-full">
              Créer une réclamation
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card hover:border-primary/40 hover:shadow-md transition-all">
          <CardContent className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Profil & Adresses</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gérez vos adresses de livraison par défaut et vos préférences de contact.
            </p>
            <Button variant="outline" size="sm" className="rounded-xl text-xs mt-2 w-full">
              Modifier mon profil
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Showcase */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-border">
          <div>
            <CardTitle className="text-base font-bold">Dernière commande</CardTitle>
            <CardDescription className="text-xs">Commande #CMD-2026-001</CardDescription>
          </div>
          <StatusBadge status="processing" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Passée le 31 Août 2026</span>
            <span className="font-bold text-foreground text-sm">189.90 €</span>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Statut livraison : En cours de préparation à l'entrepôt</span>
            </div>
            <span className="text-primary font-medium text-xs">Suivre le colis →</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
