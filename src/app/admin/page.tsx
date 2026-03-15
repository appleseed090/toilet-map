import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-zinc-400 hover:text-zinc-600 transition">
            ← Map
          </a>
          <h1 className="text-sm font-semibold text-zinc-900">toilet-map admin</h1>
        </div>
        <p className="text-xs text-zinc-400">{session.user?.email}</p>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <AdminDashboard />
      </main>
    </div>
  );
}
