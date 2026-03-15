import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.length < 3) {
    return NextResponse.json([]);
  }

  const limit = request.nextUrl.searchParams.get("limit") || "5";
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=${limit}&addressdetails=1`;

  const res = await fetch(url, {
    headers: { "User-Agent": "toilet-map/1.0" },
  });
  const data = await res.json();

  const suggestions = (data || []).map(
    (r: { display_name: string; lat: string; lon: string }) => ({
      display: r.display_name,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    })
  );

  return NextResponse.json(suggestions);
}
