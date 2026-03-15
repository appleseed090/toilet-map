"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Restroom {
  id: string;
  name: string;
  address?: string | null;
  accessType: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/restrooms")
      .then((r) => r.json())
      .then((data) => {
        setRestrooms(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this restroom?")) return;
    const res = await fetch(`/api/restrooms/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRestrooms((prev) => prev.filter((r) => r.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-6 w-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Restrooms</h1>
        <button
          onClick={() => router.push("/admin/restrooms/new")}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
        >
          + Add
        </button>
      </div>

      {restrooms.length === 0 ? (
        <p className="text-zinc-500 text-sm">No restrooms yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-200">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium hidden sm:table-cell">
                  Address
                </th>
                <th className="pb-2 font-medium hidden md:table-cell">
                  Access
                </th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restrooms.map((r) => (
                <tr key={r.id} className="border-b border-zinc-100">
                  <td className="py-3 text-zinc-900">{r.name}</td>
                  <td className="py-3 text-zinc-500 hidden sm:table-cell">
                    {r.address || "—"}
                  </td>
                  <td className="py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                      {r.accessType}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() =>
                        router.push(`/admin/restrooms/${r.id}`)
                      }
                      className="text-zinc-500 hover:text-zinc-900 mr-3 text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
