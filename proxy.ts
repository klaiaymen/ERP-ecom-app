import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Allow public routes without authentication
  if (
    pathname === "/" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api/webhooks")
  ) {
    return NextResponse.next();
  }

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // If user is not authenticated, redirect to sign-in page
  if (!userId) {
    return redirectToSignIn();
  }

  // Extract user role from sessionClaims (Clerk publicMetadata or metadata)
  const sessionData = sessionClaims as {
    publicMetadata?: { role?: string };
    metadata?: { role?: string };
  } | null;

  const userRole = sessionData?.publicMetadata?.role || sessionData?.metadata?.role || "client";

  // Enforce Admin-only access for /dashboard/utilisateurs
  if (pathname.startsWith("/dashboard/utilisateurs")) {
    if (userRole !== "admin") {
      const redirectUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Enforce Admin + Commercial access for /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    if (userRole !== "admin" && userRole !== "commercial") {
      const redirectUrl = new URL("/client", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Allow access to /client/* for any authenticated user
  if (pathname.startsWith("/client")) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|ttf|woff2?|png|jpg|jpeg|gif|svg|svgz|ico|webp|avif|mp4|webm|ogg|mp3|wav|flac|aac)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
