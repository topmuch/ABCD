import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const exists = await db.contactMessage.findUnique({ where: { id } }).catch(() => null);
    if (!exists) {
      return NextResponse.json(
        { ok: false, error: "Message introuvable" },
        { status: 404 }
      );
    }
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[messages DELETE]", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
