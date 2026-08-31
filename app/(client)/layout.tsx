import { syncUserToDatabase } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure the user is synchronized with Neon DB when accessing the client portal
  await syncUserToDatabase();

  return <>{children}</>;
}
