import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.length < 3) {
    return NextResponse.json([]);
  }

  const limit = request.nextUrl.searchParams.get("limit") || "5";
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=${limit}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "toilet-map/1.0" },
  });
  const data = await res.json();

  const suggestions = (data.features || []).map(
    (f: {
      geometry: { coordinates: number[] };
      properties: Record<string, string>;
    }) => {
      const p = f.properties;
      const parts = [
        p.housenumber && p.street
          ? `${p.housenumber} ${p.street}`
          : p.street || p.name,
        p.city || p.town || p.village,
        p.state,
        p.country,
      ].filter(Boolean);

      return {
        display: parts.join(", "),
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      };
    }
  );

  return NextResponse.json(suggestions);
}
