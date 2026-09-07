import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const DEFAULT_SEO = {
  siteTitle: "ABCD Ltd | Transit, Douane & Logistique à Dakar, Sénégal",
  metaDescription:
    "African Business Company for Development (A.B.C.D Ltd) — Transit, commissionnaire en douane, transport (air, mer, route, multimodal), supply chain, entreposage et dédouanement à Dakar, Sénégal.",
  keywords:
    "ABCD Ltd, transit Dakar, commissionnaire en douane Sénégal, freight forwarding Dakar, logistique Sénégal, transport multimodal Afrique de l'Ouest, dédouanement Dakar, entrepôt sous douane, customs broker Senegal",
  ogTitle: "ABCD Ltd | Transit & Logistique à Dakar",
  ogDescription:
    "Solutions sur mesure de transit, transport et logistique depuis Dakar vers l'Afrique de l'Ouest.",
  googleAnalyticsId: "",
  twitterHandle: "",
};

export async function GET() {
  try {
    const settings = await db.seoSettings
      .findUnique({ where: { id: "singleton" } })
      .catch(() => null);

    if (!settings) {
      // Auto-create default singleton
      const created = await db.seoSettings
        .create({ data: { id: "singleton", ...DEFAULT_SEO } })
        .catch(() => null);
      if (created) {
        return NextResponse.json({ ok: true, data: { ...DEFAULT_SEO, id: created.id, createdAt: created.createdAt.toISOString(), updatedAt: created.updatedAt.toISOString() } });
      }
      return NextResponse.json({ ok: true, data: { id: "singleton", ...DEFAULT_SEO } });
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: settings.id,
        siteTitle: settings.siteTitle,
        metaDescription: settings.metaDescription,
        keywords: settings.keywords,
        ogTitle: settings.ogTitle,
        ogDescription: settings.ogDescription,
        googleAnalyticsId: settings.googleAnalyticsId,
        twitterHandle: settings.twitterHandle,
        updatedAt: settings.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("[seo GET]", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const siteTitle = typeof body.siteTitle === "string" ? body.siteTitle.trim() : "";
    const metaDescription =
      typeof body.metaDescription === "string" ? body.metaDescription.trim() : "";

    if (!siteTitle || !metaDescription) {
      return NextResponse.json(
        { ok: false, error: "Le titre et la méta-description sont requis." },
        { status: 400 }
      );
    }

    const data = {
      siteTitle,
      metaDescription,
      keywords: typeof body.keywords === "string" ? body.keywords.trim() : "",
      ogTitle: body.ogTitle?.trim() || null,
      ogDescription: body.ogDescription?.trim() || null,
      googleAnalyticsId: body.googleAnalyticsId?.trim() || null,
      twitterHandle: body.twitterHandle?.trim() || null,
    };

    const updated = await db.seoSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data },
      update: data,
    });

    return NextResponse.json({ ok: true, updatedAt: updated.updatedAt.toISOString() });
  } catch (err) {
    console.error("[seo PUT]", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
