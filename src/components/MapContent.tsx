"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

interface Restroom {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  accessType: string;
  codeRequired: string;
  accessibility: string;
  note?: string | null;
  lastConfirmed?: string | null;
}

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function badgeColor(value: string) {
  switch (value) {
    case "free":
    case "yes":
    case "accessible":
      return "bg-emerald-100 text-emerald-800";
    case "paid":
    case "no":
    case "limited":
      return "bg-amber-100 text-amber-800";
    case "customers":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
}

export default function MapContent() {
  const searchParams = useSearchParams();
  const lat = parseFloat(searchParams.get("lat") || "34.0522");
  const lng = parseFloat(searchParams.get("lng") || "-118.2437");

  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [selected, setSelected] = useState<Restroom | null>(null);

  useEffect(() => {
    fetch("/api/restrooms")
      .then((r) => r.json())
      .then(setRestrooms)
      .catch(console.error);
  }, []);

  const sorted = useMemo(
    () =>
      [...restrooms].sort(
        (a, b) =>
          getDistance(lat, lng, a.latitude, a.longitude) -
          getDistance(lat, lng, b.latitude, b.longitude)
      ),
    [restrooms, lat, lng]
  );

  const distanceToSelected = selected
    ? getDistance(lat, lng, selected.latitude, selected.longitude)
    : null;

  return (
    <div className="relative h-[100dvh] w-full">
      <MapView
        lat={lat}
        lng={lng}
        restrooms={sorted}
        selected={selected}
        onSelect={setSelected}
      />

      {/* Back to home */}
      <a
        href="/"
        className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-md hover:bg-white transition"
      >
        ← Back
      </a>

      {/* Detail card */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-96">
          <div className="bg-white/95 backdrop-blur-lg shadow-2xl rounded-t-2xl md:rounded-none md:h-full p-5 md:p-6 md:overflow-y-auto">
            {/* Drag handle on mobile */}
            <div className="w-10 h-1 bg-zinc-300 rounded-full mx-auto mb-4 md:hidden" />

            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold text-zinc-900">
                {selected.name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-zinc-400 hover:text-zinc-600 text-xl leading-none p-1"
              >
                ×
              </button>
            </div>

            {distanceToSelected !== null && (
              <p className="text-sm text-zinc-500 mb-2">
                {distanceToSelected.toFixed(2)} mi away
              </p>
            )}

            {selected.address && (
              <p className="text-sm text-zinc-600 mb-3">{selected.address}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeColor(selected.accessType)}`}
              >
                {selected.accessType}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeColor(selected.codeRequired)}`}
              >
                Code: {selected.codeRequired}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeColor(selected.accessibility)}`}
              >
                {selected.accessibility}
              </span>
            </div>

            {selected.note && (
              <p className="text-sm text-zinc-600 mb-3 bg-zinc-50 rounded-lg p-3">
                {selected.note}
              </p>
            )}

            {selected.lastConfirmed && (
              <p className="text-xs text-zinc-400 mb-4">
                Last confirmed:{" "}
                {new Date(selected.lastConfirmed).toLocaleDateString()}
              </p>
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-zinc-900 text-white rounded-xl py-3 text-sm font-medium hover:bg-zinc-800 transition"
            >
              Open in Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
