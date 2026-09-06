"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Truck,
  CreditCard,
  Banknote,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createClientOrder } from "@/actions/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderCompleted, setOrderCompleted] = React.useState<{
    orderNumber: string;
    totalAmount: number;
  } | null>(null);

  const { items, clearCart, getTotalPrice } = useCart();

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    paymentMethod: "cash_on_delivery" as "cash_on_delivery" | "card",
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const subtotal = getTotalPrice();
  const shippingFee = subtotal >= 150 ? 0 : 7;
  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city) {
      toast.error("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("Enregistrement de votre commande...");

      const result = await createClientOrder({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || "client@omnistock.tn",
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({
          variantId: item.variantId,
          productId: item.productId,
          name: item.name,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      toast.dismiss();
      toast.success(`Commande #${result.orderNumber} confirmée avec succès !`);

      clearCart();
      setOrderCompleted({
        orderNumber: result.orderNumber,
        totalAmount: result.totalAmount,
      });
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Erreur lors de la validation de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full border-border/80 bg-card text-center p-8 space-y-6 shadow-xl rounded-2xl">
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              Commande Confirmée
            </Badge>
            <h2 className="text-2xl font-extrabold text-foreground">Merci pour votre achat !</h2>
            <p className="text-xs text-muted-foreground">
              Votre commande <strong className="text-foreground">#{orderCompleted.orderNumber}</strong> d&apos;un montant de{" "}
              <strong className="text-primary">{orderCompleted.totalAmount.toFixed(2)} TND</strong> a bien été enregistrée et est en cours de traitement.
            </p>
          </div>

          <div className="p-4 bg-muted/40 rounded-xl text-xs text-muted-foreground space-y-1 text-left">
            <p className="flex items-center gap-1.5 text-foreground font-semibold">
              <Truck className="h-4 w-4 text-primary" /> Livraison estimée : Sous 24h à 48h
            </p>
            <p>Un conseiller vous contactera par téléphone pour valider l&apos;expédition.</p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={() => router.push("/client")}
              className="w-full rounded-xl font-bold bg-primary text-primary-foreground h-10 shadow-md"
            >
              Consulter mon espace client
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full rounded-xl text-xs h-9"
            >
              Retourner à la boutique
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // EMPTY CART FALLBACK
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full border-border bg-card text-center p-8 space-y-4 rounded-2xl">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Votre panier est vide</h2>
          <p className="text-xs text-muted-foreground">
            Vous n&apos;avez aucun article à commander pour le moment.
          </p>
          <Button onClick={() => router.push("/")} className="rounded-xl font-bold gap-2">
            <ArrowLeft className="h-4 w-4" /> Explorer le catalogue
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour à la boutique
        </Link>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span className="text-xs font-bold text-muted-foreground">Paiement 100% Sécurisé</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping & Payment Form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          {/* Shipping Info Card */}
          <Card className="border-border/80 bg-card shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> 1. Adresse de Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Prénom *</Label>
                  <Input
                    placeholder="Ex: Mohamed"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nom *</Label>
                  <Input
                    placeholder="Ex: Ben Ali"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Téléphone de contact *</Label>
                  <Input
                    placeholder="Ex: 50 123 456"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Email (Optionnel)</Label>
                  <Input
                    type="email"
                    placeholder="exemple@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Adresse exacte de livraison *</Label>
                <Input
                  placeholder="Rue, numéro, quartier, résidence..."
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Gouvernorat / Ville *</Label>
                  <Input
                    placeholder="Ex: Tunis, Sousse, Sfax..."
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Code Postal</Label>
                  <Input
                    placeholder="Ex: 1000"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Notes de livraison (Optionnel)</Label>
                <Textarea
                  placeholder="Instructions pour le livreur (ex: sonner au 2ème étage)..."
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection Card */}
          <Card className="border-border/80 bg-card shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" /> 2. Mode de Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: "cash_on_delivery" })}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === "cash_on_delivery"
                    ? "border-primary bg-primary/5"
                    : "border-border/60 hover:border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-emerald-500" />
                  <div>
                    <span className="font-bold text-xs text-foreground block">
                      Paiement à la livraison (Espèces)
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Payez directement au livreur lors de la réception de votre colis.
                    </span>
                  </div>
                </div>
                <span className="h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                  {formData.paymentMethod === "cash_on_delivery" && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </span>
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: "card" })}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === "card"
                    ? "border-primary bg-primary/5"
                    : "border-border/60 hover:border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div>
                    <span className="font-bold text-xs text-foreground block">
                      Carte Bancaire (En ligne)
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Paiement rapide et sécurisé par carte bancaire.
                    </span>
                  </div>
                </div>
                <span className="h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                  {formData.paymentMethod === "card" && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </span>
              </label>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-sm font-extrabold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
          >
            {isSubmitting ? "Validation en cours..." : `Confirmer la commande (${totalAmount.toFixed(2)} TND)`}
          </Button>
        </form>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/80 bg-card shadow-sm rounded-2xl sticky top-20">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" /> Récapitulatif ({items.length})
                </span>
                <span className="text-xs text-muted-foreground font-normal">Taxes incluses</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-lg bg-muted border border-border/40 overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground truncate">{item.name}</h4>
                      <p className="text-[10px] text-muted-foreground">
                        {item.variantName} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-primary shrink-0">
                    {(item.price * item.quantity).toFixed(2)} TND
                  </span>
                </div>
              ))}
            </CardContent>

            <Separator />

            <CardFooter className="p-4 flex-col space-y-2.5">
              <div className="flex justify-between text-xs text-muted-foreground w-full">
                <span>Sous-total articles</span>
                <span className="font-semibold text-foreground">{subtotal.toFixed(2)} TND</span>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground w-full">
                <span>Frais de livraison</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-500 font-bold">Gratuit (Offerte)</span>
                ) : (
                  <span className="font-semibold text-foreground">{shippingFee.toFixed(2)} TND</span>
                )}
              </div>

              <Separator />

              <div className="flex justify-between text-sm font-black text-foreground w-full pt-1">
                <span>Total Général TTC</span>
                <span className="text-primary text-base">{totalAmount.toFixed(2)} TND</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
