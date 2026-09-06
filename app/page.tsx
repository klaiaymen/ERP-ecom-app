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
import { syncUserToDatabase, getUserRole } from "@/lib/auth";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CartSheet } from "@/components/shared/CartSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { isNull } from "drizzle-orm";
import { PublicProductGrid } from "@/components/client/PublicProductGrid";

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const { userId } = await auth();
  let userRole: string | null = null;

  if (userId) {
    await syncUserToDatabase();
    userRole = await getUserRole();
  }

  // Fetch active products for client store
  const dbProducts = await db.query.products.findMany({
    where: isNull(products.deletedAt),
    with: {
      category: true,
      images: {
        orderBy: (images, { asc }) => [asc(images.position)],
      },
      variants: {
        where: isNull(productVariants.deletedAt),
        with: {
          stock: true,
        },
      },
    },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    limit: 12,
  });

  const formattedProducts = dbProducts.map((p) => {
    let totalStock = 0;
    p.variants.forEach((v) => {
      if (v.stock) {
        totalStock += v.stock.quantity ?? 0;
      }
    });

    let stockStatus: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";
    if (totalStock === 0) stockStatus = "out_of_stock";
    else if (totalStock <= 5) stockStatus = "low_stock";

    const mainImage =
      p.images.find((img) => img.isPrimary)?.url ||
      p.images[0]?.url ||
      p.imageUrl ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";

    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      description: p.description,
      mainImageUrl: mainImage,
      totalStock,
      stockStatus,
      category: p.category ? { name: p.category.name } : null,
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
      })),
    };
  });

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
              <Link href="#catalogue" className="text-foreground hover:text-primary transition-colors">
                Catalogue Boutique
              </Link>
              {userId && (
                <Link href="/client" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5" />
                  Mon Espace Client
                </Link>
              )}
              {(userRole === "admin" || userRole === "commercial") && (
                <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1 text-primary">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Back-Office Admin
                </Link>
              )}
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
      <section className="relative overflow-hidden py-16 sm:py-20 border-b border-border bg-radial from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> E-Commerce Premium Client & ERP Intégré
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Boutique en ligne <br />
            <span className="text-primary bg-clip-text">Commandez vos articles préférés</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Parcourez le catalogue, ajoutez des articles à votre panier et gérez facilement vos commandes depuis votre espace client personnalisé.
          </p>
        </div>
      </section>

      {/* Public Product Catalogue Section */}
      <section id="catalogue" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 flex-1 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" /> Nos Produits Disponibles
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sélection de nos derniers articles en stock.
            </p>
          </div>
        </div>

        <PublicProductGrid products={formattedProducts} />
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border bg-card text-muted-foreground text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 OmniStock Store. Next.js 15, Drizzle ORM, Tailwind CSS & Clerk Auth.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">Boutique</Link>
            <Link href="/client" className="hover:text-foreground transition-colors">Espace Client</Link>
            {(userRole === "admin" || userRole === "commercial") && (
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard Admin</Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
