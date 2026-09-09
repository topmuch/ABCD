import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export async function GET() {
  try {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start7days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const start30days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalViews,
      viewsToday,
      uniqueVisitors30,
      totalClicks,
      whatsappClicks,
      phoneClicks,
      formsSent,
      appointments,
      recentViewsRaw,
      topPagesRaw,
      referrersRaw,
      devicesRaw,
      browsersRaw,
      dailyRaw,
    ] = await Promise.all([
      db.pageView.count().catch(() => 0),
      db.pageView.count({ where: { createdAt: { gte: startToday } } }).catch(() => 0),
      db.pageView.findMany({
        where: { createdAt: { gte: start30days } },
        select: { sessionId: true },
        distinct: ["sessionId"],
      }).then((r) => r.length).catch(() => 0),
      db.clickEvent.count().catch(() => 0),
      db.clickEvent.count({ where: { type: "whatsapp" } }).catch(() => 0),
      db.clickEvent.count({ where: { type: "phone" } }).catch(() => 0),
      db.contactMessage.count({ where: { createdAt: { gte: start30days } } }).catch(() => 0),
      db.appointment.count({ where: { createdAt: { gte: start30days } } }).catch(() => 0),
      db.pageView.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { createdAt: true, path: true, device: true, country: true, city: true },
      }).catch(() => []),
      db.pageView.groupBy({ by: ["path"], _count: true, orderBy: { _count: { path: "desc" } }, take: 10 }).catch(() => []),
      db.pageView.groupBy({ by: ["referrer"], _count: true, orderBy: { _count: { referrer: "desc" } }, take: 8 }).catch(() => []),
      db.pageView.groupBy({ by: ["device"], _count: true }).catch(() => []),
      db.pageView.groupBy({ by: ["browser"], _count: true }).catch(() => []),
      db.pageView.findMany({
        where: { createdAt: { gte: start7days } },
        select: { createdAt: true },
      }).catch(() => []),
    ]);

    // Build daily series for last 7 days
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      dailyMap[key] = 0;
    }
    dailyRaw.forEach((v) => {
      const d = v.createdAt;
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      if (key in dailyMap) dailyMap[key] += 1;
    });
    const daily = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    // Monthly series for last 6 months
    const monthly: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = d;
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await db.pageView.count({
        where: { createdAt: { gte: start, lt: end } },
      }).catch(() => 0);
      monthly.push({ month: MONTHS_FR[d.getMonth()], count });
    }

    return NextResponse.json({
      ok: true,
      stats: {
        totalViews,
        viewsToday,
        uniqueVisitors30,
        totalClicks,
        whatsappClicks,
        phoneClicks,
        formsSent,
        appointments,
      },
      topPages: topPagesRaw.map((p) => ({ path: p.path, count: p._count })),
      referrers: referrersRaw
        .filter((r) => r.referrer && r.referrer !== "null")
        .map((r) => ({ referrer: r.referrer, count: r._count })),
      devices: devicesRaw.map((d) => ({ device: d.device, count: d._count })),
      browsers: browsersRaw.map((b) => ({ browser: b.browser, count: b._count })),
      daily,
      monthly,
      recentViews: recentViewsRaw,
      generatedAt: now.toISOString(),
    });
  } catch (err) {
    console.error("[stats]", err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
