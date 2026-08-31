import { syncUserToDatabase } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure the user is synchronized with Neon DB when accessing the back-office dashboard
  await syncUserToDatabase();

  return <>{children}</>;
}
