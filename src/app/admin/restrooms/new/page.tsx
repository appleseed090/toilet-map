import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import RestroomForm from "@/components/RestroomForm";

export default async function NewRestroomPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-zinc-100 px-6 py-4">
        <a
          href="/admin"
          className="text-sm text-zinc-400 hover:text-zinc-600 transition"
        >
          ← Back to dashboard
        </a>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-zinc-900 mb-6">
          Add restroom
        </h1>
        <RestroomForm />
      </main>
    </div>
  );
}
