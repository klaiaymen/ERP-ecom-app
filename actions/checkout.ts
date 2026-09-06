"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  orders,
  orderItems,
  stocks,
  stockMovements,
  users,
  productVariants,
} from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { syncUserToDatabase } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export const checkoutInputSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Numéro de téléphone requis"),
  address: z.string().min(3, "Adresse de livraison requise"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cash_on_delivery", "card"]).default("cash_on_delivery"),
  items: z.array(
    z.object({
      variantId: z.string().min(1),
      productId: z.string().min(1),
      name: z.string(),
      variantName: z.string(),
      price: z.number().min(0),
      quantity: z.number().min(1),
    })
  ).min(1, "Le panier ne peut être vide"),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;

export async function createClientOrder(input: CheckoutInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Vous devez être connecté pour passer une commande.");
  }

  // Ensure user is synced to Neon database
  const dbUser = await syncUserToDatabase();
  if (!dbUser) {
    throw new Error("Erreur de synchronisation du compte utilisateur.");
  }

  const validated = checkoutInputSchema.parse(input);

  const subtotal = validated.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 150 ? 0 : 7; // Delivery 7 TND if under 150 TND
  const totalAmount = subtotal + shippingFee;

  const orderNumber = `CMD-${new Date().getFullYear()}-${Math.floor(
    10000 + Math.random() * 90000
  )}`;

  // Insert Order into DB
  const [newOrder] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId: dbUser.id,
      status: "confirmed",
      totalAmount: totalAmount.toString(),
      shippingFee: shippingFee.toString(),
      taxAmount: "0",
      discountAmount: "0",
      deliveryStatus: "pending",
      shippingAddress: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone,
        address: validated.address,
        city: validated.city,
        postalCode: validated.postalCode || "",
        notes: validated.notes || "",
        paymentMethod: validated.paymentMethod,
      },
    })
    .returning();

  // Insert Order Items and Update Stocks
  for (const item of validated.items) {
    const itemTotal = item.price * item.quantity;

    await db.insert(orderItems).values({
      orderId: newOrder.id,
      variantId: item.variantId,
      unitPrice: item.price.toString(),
      quantity: item.quantity,
      totalPrice: itemTotal.toString(),
    });

    // Update Stock & Movement
    const existingStock = await db.query.stocks.findFirst({
      where: eq(stocks.variantId, item.variantId),
    });

    if (existingStock) {
      const prevQty = existingStock.quantity;
      const newQty = Math.max(0, prevQty - item.quantity);

      await db
        .update(stocks)
        .set({
          quantity: newQty,
          updatedAt: new Date(),
        })
        .where(eq(stocks.id, existingStock.id));

      await db.insert(stockMovements).values({
        variantId: item.variantId,
        type: "out",
        quantity: item.quantity,
        previousQuantity: prevQty,
        newQuantity: newQty,
        reason: `Vente Client - Commande ${orderNumber}`,
        performedByUserId: dbUser.id,
      });
    }
  }

  revalidatePath("/client");
  revalidatePath("/dashboard/commandes");
  revalidatePath("/dashboard/produits");

  return {
    success: true,
    orderNumber: newOrder.orderNumber,
    orderId: newOrder.id,
    totalAmount,
  };
}
