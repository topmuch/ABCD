import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const exists = await db.appointment.findUnique({ where: { id } }).catch(() => null);
    if (!exists) {
      return NextResponse.json({ ok: false, error: "Rendez-vous introuvable" }, { status: 404 });
    }
    const updated = await db.appointment.update({
      where: { id },
      data: {
        status: typeof body.status === "string" ? body.status : undefined,
      },
    });
    return NextResponse.json({ ok: true, id: updated.id });
  } catch (err) {
    console.error("[appointments PUT]", err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const exists = await db.appointment.findUnique({ where: { id } }).catch(() => null);
    if (!exists) {
      return NextResponse.json({ ok: false, error: "Rendez-vous introuvable" }, { status: 404 });
    }
    await db.appointment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[appointments DELETE]", err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
