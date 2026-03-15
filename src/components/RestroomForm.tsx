"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RestroomFormProps {
  restroomId?: string;
}

export default function RestroomForm({ restroomId }: RestroomFormProps) {
  const router = useRouter();
  const isEdit = !!restroomId;

  const [form, setForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
    address: "",
    accessType: "unknown",
    codeRequired: "unknown",
    accessibility: "unknown",
    note: "",
    lastConfirmed: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/restrooms/${restroomId}`)
        .then((r) => r.json())
        .then((data) => {
          setForm({
            name: data.name || "",
            latitude: String(data.latitude),
            longitude: String(data.longitude),
            address: data.address || "",
            accessType: data.accessType || "unknown",
            codeRequired: data.codeRequired || "unknown",
            accessibility: data.accessibility || "unknown",
            note: data.note || "",
            lastConfirmed: data.lastConfirmed
              ? new Date(data.lastConfirmed).toISOString().slice(0, 10)
              : "",
          });
        });
    }
  }, [isEdit, restroomId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      address: form.address || null,
      accessType: form.accessType,
      codeRequired: form.codeRequired,
      accessibility: form.accessibility,
      note: form.note || null,
      lastConfirmed: form.lastConfirmed || null,
    };

    const url = isEdit ? `/api/restrooms/${restroomId}` : "/api/restrooms";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
    setSaving(false);
  }

  const inputClass =
    "w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition";
  const labelClass = "block text-sm font-medium text-zinc-700 mb-1";
  const selectClass =
    "w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition";

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Name *</label>
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="e.g. Starbucks on 5th"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Latitude *</label>
          <input
            className={inputClass}
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            required
            placeholder="34.0522"
          />
        </div>
        <div>
          <label className={labelClass}>Longitude *</label>
          <input
            className={inputClass}
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            required
            placeholder="-118.2437"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <input
          className={inputClass}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="123 Main St, Los Angeles, CA"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Access type</label>
          <select
            className={selectClass}
            value={form.accessType}
            onChange={(e) => setForm({ ...form, accessType: e.target.value })}
          >
            <option value="unknown">Unknown</option>
            <option value="free">Free</option>
            <option value="customers">Customers</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Code required</label>
          <select
            className={selectClass}
            value={form.codeRequired}
            onChange={(e) => setForm({ ...form, codeRequired: e.target.value })}
          >
            <option value="unknown">Unknown</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Accessibility</label>
          <select
            className={selectClass}
            value={form.accessibility}
            onChange={(e) =>
              setForm({ ...form, accessibility: e.target.value })
            }
          >
            <option value="unknown">Unknown</option>
            <option value="accessible">Accessible</option>
            <option value="limited">Limited</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Note</label>
        <textarea
          className={inputClass}
          rows={3}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Any helpful details..."
        />
      </div>

      <div>
        <label className={labelClass}>Last confirmed</label>
        <input
          className={inputClass}
          type="date"
          value={form.lastConfirmed}
          onChange={(e) => setForm({ ...form, lastConfirmed: e.target.value })}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="text-zinc-500 hover:text-zinc-700 px-5 py-2.5 text-sm font-medium transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
