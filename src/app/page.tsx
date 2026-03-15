"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  function handleGeolocate() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        router.push(`/map?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
      },
      () => {
        setError("Unable to get your location. Try searching instead.");
        setLocating(false);
      }
    );
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setError("");
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.length > 0) {
      router.push(`/map?lat=${data[0].lat}&lng=${data[0].lon}`);
    } else {
      setError("No results found. Try a different search.");
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-1">
          toilet-map
        </h1>
        <p className="text-zinc-500 text-sm mb-10">Find a nearby restroom.</p>

        <button
          onClick={handleGeolocate}
          disabled={locating}
          className="w-full bg-zinc-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-50 mb-4"
        >
          {locating ? "Locating…" : "📍 Use my location"}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs text-zinc-400">or</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an address or city"
            className="flex-1 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition"
          />
          <button
            type="submit"
            className="bg-zinc-900 text-white px-5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition"
          >
            Search
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-xs mt-3">{error}</p>
        )}
      </div>
    </div>
  );
}
