"use client";

import { useEffect, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "hue-rotate-180 brightness-150",
});

L.Marker.prototype.options.icon = defaultIcon;

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

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const hasRecentered = useRef(false);
  useEffect(() => {
    if (!hasRecentered.current) {
      map.setView([lat, lng], 15);
      hasRecentered.current = true;
    }
  }, [map, lat, lng]);
  return null;
}

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // miles
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

export default function MapView({
  lat,
  lng,
  restrooms,
  selected,
  onSelect,
}: {
  lat: number;
  lng: number;
  restrooms: Restroom[];
  selected: Restroom | null;
  onSelect: (r: Restroom | null) => void;
}) {
  const center = useMemo((): [number, number] => [lat, lng], [lat, lng]);

  return (
    <MapContainer
      center={center}
      zoom={15}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap lat={lat} lng={lng} />
      <Marker position={[lat, lng]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>
      {restrooms.map((r) => (
        <Marker
          key={r.id}
          position={[r.latitude, r.longitude]}
          icon={defaultIcon}
          eventHandlers={{
            click: () => onSelect(selected?.id === r.id ? null : r),
          }}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold text-sm">{r.name}</p>
              <p className="text-xs text-zinc-500">
                {getDistance(lat, lng, r.latitude, r.longitude).toFixed(2)} mi
              </p>
              {r.address && (
                <p className="text-xs text-zinc-500 mt-1">{r.address}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${badgeColor(r.accessType)}`}
                >
                  {r.accessType}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${badgeColor(r.codeRequired)}`}
                >
                  code: {r.codeRequired}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${badgeColor(r.accessibility)}`}
                >
                  {r.accessibility}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
