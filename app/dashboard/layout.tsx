import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "owner") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="flex">
        <aside className="w-64 min-h-screen border-r border-white/5 bg-slate-900/60 p-6 sticky top-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-lg shadow-lg shadow-amber-500/30">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-bold">BizMenu</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Admin Panel
              </p>
            </div>
          </div>
          <nav className="space-y-1 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition"
            >
              <i className="fa-solid fa-chart-line text-amber-400/60 w-5" />
              Overview
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition"
            >
              <i className="fa-solid fa-receipt text-amber-400/60 w-5" />
              Order Management
            </Link>
            <Link
              href="/dashboard/menu"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition"
            >
              <i className="fa-solid fa-utensils text-amber-400/60 w-5" />
              Menu Items
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition"
            >
              <i className="fa-solid fa-gear text-amber-400/60 w-5" />
              Settings
            </Link>
            <div className="border-t border-white/5 my-4" />
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition text-slate-400"
            >
              <i className="fa-solid fa-arrow-left w-5" />
              Back to Store
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
