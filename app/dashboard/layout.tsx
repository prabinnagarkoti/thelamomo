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
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-64 md:min-h-screen border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/60 p-4 md:p-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3 mb-4 md:mb-8">
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
          <nav className="flex md:flex-col gap-2 md:gap-0 md:space-y-1 text-sm overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 md:px-3 rounded-xl hover:bg-slate-800 transition whitespace-nowrap"
            >
              <i className="fa-solid fa-chart-line text-amber-400/60 w-5" />
              Overview
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 px-4 py-2.5 md:px-3 rounded-xl hover:bg-slate-800 transition whitespace-nowrap"
            >
              <i className="fa-solid fa-receipt text-amber-400/60 w-5" />
              Order Management
            </Link>
            <Link
              href="/dashboard/menu"
              className="flex items-center gap-3 px-4 py-2.5 md:px-3 rounded-xl hover:bg-slate-800 transition whitespace-nowrap"
            >
              <i className="fa-solid fa-utensils text-amber-400/60 w-5" />
              Menu Items
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-2.5 md:px-3 rounded-xl hover:bg-slate-800 transition whitespace-nowrap"
            >
              <i className="fa-solid fa-gear text-amber-400/60 w-5" />
              Settings
            </Link>
            <div className="hidden md:block border-t border-white/5 my-4" />
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 md:px-3 rounded-xl hover:bg-slate-800 transition text-slate-400 whitespace-nowrap"
            >
              <i className="fa-solid fa-arrow-left w-5" />
              Back to Store
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
