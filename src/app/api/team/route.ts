import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { role: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [total, items] = await Promise.all([
      db.teamMember.count({ where }).catch(() => 0),
      db.teamMember
        .findMany({
          where,
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        })
        .catch(() => []),
    ]);

    return NextResponse.json({
      ok: true,
      total,
      data: items.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        email: m.email,
        phone: m.phone,
        bio: m.bio,
        photoUrl: m.photoUrl,
        yearsExperience: m.yearsExperience,
        order: m.order,
        active: m.active,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[team GET]", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "";

    if (!name || !role) {
      return NextResponse.json(
        { ok: false, error: "Le nom et le poste sont requis." },
        { status: 400 }
      );
    }

    const created = await db.teamMember.create({
      data: {
        name,
        role,
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        bio: body.bio?.trim() || null,
        photoUrl: body.photoUrl?.trim() || null,
        yearsExperience: typeof body.yearsExperience === "number" ? body.yearsExperience : null,
        order: typeof body.order === "number" ? body.order : 0,
        active: typeof body.active === "boolean" ? body.active : true,
      },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("[team POST]", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
