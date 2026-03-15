import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const restrooms = await prisma.restroom.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(restrooms);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const restroom = await prisma.restroom.create({
    data: {
      name: body.name,
      latitude: body.latitude,
      longitude: body.longitude,
      address: body.address || null,
      accessType: body.accessType || "unknown",
      codeRequired: body.codeRequired || "unknown",
      accessibility: body.accessibility || "unknown",
      note: body.note || null,
      lastConfirmed: body.lastConfirmed ? new Date(body.lastConfirmed) : null,
    },
  });
  return NextResponse.json(restroom, { status: 201 });
}
