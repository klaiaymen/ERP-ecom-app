import { syncUserToDatabase, getUserRole } from "@/lib/auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { DashboardHeader } from "@/components/shared/DashboardHeader";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Synchronize user to Neon DB and fetch role
  await syncUserToDatabase();
  const role = await getUserRole();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <DashboardSidebar userRole={role ?? "commercial"} />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-background">
          <DashboardHeader userRole={role ?? "commercial"} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
