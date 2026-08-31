import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent, createClerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(req: Request) {
  if (!clerkWebhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not configured.");
    return new NextResponse("Webhook secret missing", { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with secret
  const wh = new Webhook(clerkWebhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occurred during verification", {
      status: 400,
    });
  }

  const eventType = evt.type;

  // Event 1: user.created
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, phone_numbers, public_metadata } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address || "";
    const primaryPhone = phone_numbers?.[0]?.phone_number || null;
    const role = (public_metadata?.role as "admin" | "commercial" | "client") || "client";

    try {
      // Upsert into Neon Postgres DB
      await db
        .insert(users)
        .values({
          clerkUserId: id,
          email: primaryEmail,
          firstName: first_name || null,
          lastName: last_name || null,
          phone: primaryPhone,
          role: role,
        })
        .onConflictDoUpdate({
          target: users.clerkUserId,
          set: {
            email: primaryEmail,
            firstName: first_name || null,
            lastName: last_name || null,
            phone: primaryPhone,
            role: role,
            updatedAt: new Date(),
          },
        });

      // Ensure Clerk publicMetadata has role set if missing
      if (!public_metadata?.role) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            role: "client",
          },
        });
      }

      return NextResponse.json({ success: true, message: "User created and synced" });
    } catch (dbError) {
      console.error("Error inserting user to database:", dbError);
      return new NextResponse("Database synchronization error", { status: 500 });
    }
  }

  // Event 2: user.updated
  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, phone_numbers, public_metadata } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address || "";
    const primaryPhone = phone_numbers?.[0]?.phone_number || null;
    const role = (public_metadata?.role as "admin" | "commercial" | "client") || "client";

    try {
      await db
        .update(users)
        .set({
          email: primaryEmail,
          firstName: first_name || null,
          lastName: last_name || null,
          phone: primaryPhone,
          role: role,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkUserId, id));

      return NextResponse.json({ success: true, message: "User updated and synced" });
    } catch (dbError) {
      console.error("Error updating user in database:", dbError);
      return new NextResponse("Database update error", { status: 500 });
    }
  }

  // Event 3: user.deleted
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (id) {
      try {
        await db.delete(users).where(eq(users.clerkUserId, id));
        return NextResponse.json({ success: true, message: "User deleted and synced" });
      } catch (dbError) {
        console.error("Error deleting user from database:", dbError);
        return new NextResponse("Database delete error", { status: 500 });
      }
    }
  }

  return NextResponse.json({ success: true });
}
