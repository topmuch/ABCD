import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [total, items] = await Promise.all([
      db.appointment.count({ where }).catch(() => 0),
      db.appointment.findMany({ where, orderBy: { createdAt: "desc" } }).catch(() => []),
    ]);

    return NextResponse.json({
      ok: true,
      total,
      data: items.map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        phone: a.phone,
        company: a.company,
        subject: a.subject,
        preferredDate: a.preferredDate,
        preferredTime: a.preferredTime,
        message: a.message,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[appointments GET]", err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Nom, email et message requis." },
        { status: 400 }
      );
    }

    const created = await db.appointment.create({
      data: {
        name,
        email,
        phone: body.phone?.trim() || null,
        company: body.company?.trim() || null,
        subject: body.subject?.trim() || null,
        preferredDate: body.preferredDate?.trim() || null,
        preferredTime: body.preferredTime?.trim() || null,
        message,
        status: "pending",
      },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("[appointments POST]", err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
