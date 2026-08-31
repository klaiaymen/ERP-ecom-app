import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-yellow-400" /> Notifications & Alertes
          </h1>
        </div>
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
          Module Notifications prêt.
        </div>
      </div>
    </div>
  );
}
