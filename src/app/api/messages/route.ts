import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "10")));
    const search = (searchParams.get("search") || "").trim();

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { subject: { contains: search } },
            { message: { contains: search } },
          ],
        }
      : {};

    const [total, items] = await Promise.all([
      db.contactMessage.count({ where }).catch(() => 0),
      db.contactMessage
        .findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        })
        .catch(() => []),
    ]);

    return NextResponse.json({
      ok: true,
      data: items.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        subject: m.subject,
        message: m.message,
        createdAt: m.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    console.error("[messages] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
