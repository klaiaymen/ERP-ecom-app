import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type UserRole = "admin" | "commercial" | "client";

export interface CustomSessionClaims {
  publicMetadata?: {
    role?: UserRole;
  };
  metadata?: {
    role?: UserRole;
  };
}

/**
 * Synchronizes the currently authenticated Clerk user to the Neon database `users` table.
 * Uses an upsert pattern (insert if absent, update if present).
 */
export async function syncUserToDatabase() {
  const user = await currentUser();
  if (!user) return null;

  const primaryEmail = user.emailAddresses[0]?.emailAddress ?? "";
  const primaryPhone = user.phoneNumbers[0]?.phoneNumber ?? null;
  const role = (user.publicMetadata?.role as UserRole) || "client";

  try {
    const [syncedUser] = await db
      .insert(users)
      .values({
        clerkUserId: user.id,
        email: primaryEmail,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        phone: primaryPhone,
        role: role,
      })
      .onConflictDoUpdate({
        target: users.clerkUserId,
        set: {
          email: primaryEmail,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          phone: primaryPhone,
          role: role,
          updatedAt: new Date(),
        },
      })
      .returning();

    return syncedUser;
  } catch (error) {
    console.error("Error synchronizing user to database:", error);
    return null;
  }
}

/**
 * Get the current user's role from Clerk sessionClaims or publicMetadata.
 * Returns 'admin', 'commercial', 'client', or null if unauthenticated.
 */
export async function getUserRole(): Promise<UserRole | null> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return null;
  }

  const claims = sessionClaims as unknown as CustomSessionClaims | null;
  let role = claims?.publicMetadata?.role || claims?.metadata?.role;

  if (!role) {
    try {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkUserId, userId),
      });
      if (dbUser && dbUser.role) {
        role = dbUser.role;
      }
    } catch (e) {
      console.error("Error fetching user role from DB:", e);
    }
  }

  return role || "client";
}

/**
 * Require specific user role(s). If unauthenticated or role not allowed,
 * redirects or throws an error. Also guarantees database sync for the user.
 */
export async function requireRole(
  allowedRoles: UserRole[],
  redirectTo: string = "/client"
): Promise<{ userId: string; role: UserRole }> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const role = await getUserRole();

  if (!role || !allowedRoles.includes(role)) {
    redirect(redirectTo);
  }

  // Synchronize user into Neon DB
  await syncUserToDatabase();

  return { userId, role };
}

/**
 * Helper to fetch both current Clerk user info and role while ensuring DB synchronization.
 */
export async function getAuthUser() {
  const user = await currentUser();
  const role = await getUserRole();

  if (!user) {
    return null;
  }

  // Sync to database
  const dbUser = await syncUserToDatabase();

  return {
    clerkUser: user,
    dbUser,
    userId: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? "",
    firstName: user.firstName,
    lastName: user.lastName,
    role: role ?? "client",
  };
}
