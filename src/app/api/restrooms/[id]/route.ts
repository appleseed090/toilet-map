import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restroom = await prisma.restroom.findUnique({ where: { id } });
  if (!restroom) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(restroom);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const restroom = await prisma.restroom.update({
    where: { id },
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
  return NextResponse.json(restroom);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.restroom.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
