import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Package, ShoppingBag, ArrowLeft } from "lucide-react";
import { syncUserToDatabase } from "@/lib/auth";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CartSheet } from "@/components/shared/CartSheet";

export const dynamic = "force-dynamic";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await syncUserToDatabase();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Client Header */}
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <Package className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-foreground">
                OmniStock <span className="text-primary text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 ml-0.5">Client</span>
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Boutique
              </Link>
              <Link href="/client" className="text-foreground font-semibold">
                Mon Espace
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <CartSheet />
            <ThemeToggle />
            <div className="pl-1">
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground bg-muted/20">
        <p>© 2026 OmniStock — Espace Client Sécurisé.</p>
      </footer>
    </div>
  );
}
