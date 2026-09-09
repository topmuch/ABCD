/**
 * Standalone seed script for production deployment.
 * Creates the default admin user from env vars ADMIN_EMAIL / ADMIN_PASSWORD.
 * Safe to run multiple times (idempotent).
 *
 * Usage: bun scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID();
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${salt}:${hash}`;
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@abcd.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "abcd2025";
  const name = process.env.ADMIN_NAME || "Administrateur ABCD";

  const existing = await db.user.findUnique({ where: { email } }).catch(() => null);

  if (existing) {
    console.log(`[seed] Admin user already exists: ${email}`);
  } else {
    const passwordHash = await hashPassword(password);
    await db.user.create({
      data: { email, name, passwordHash, role: "admin" },
    });
    console.log(`[seed] Admin user created: ${email}`);
    if (!process.env.ADMIN_PASSWORD) {
      console.log(`[seed] WARNING: using default password. Set ADMIN_PASSWORD env var in production.`);
    }
  }

  // Seed default SEO settings if missing
  const seo = await db.seoSettings.findUnique({ where: { id: "singleton" } }).catch(() => null);
  if (!seo) {
    await db.seoSettings.create({
      data: {
        id: "singleton",
        siteTitle: "ABCD Ltd | Transit, Douane & Logistique à Dakar, Sénégal",
        metaDescription:
          "African Business Company for Development (A.B.C.D Ltd) — Transit, commissionnaire en douane, transport (air, mer, route, multimodal), supply chain, entreposage et dédouanement à Dakar, Sénégal.",
        keywords:
          "ABCD Ltd, transit Dakar, commissionnaire en douane Sénégal, freight forwarding Dakar, logistique Sénégal",
      },
    });
    console.log("[seed] Default SEO settings created.");
  } else {
    console.log("[seed] SEO settings already exist.");
  }

  await db.$disconnect();
  console.log("[seed] Done.");
}

main().catch((e) => {
  console.error("[seed] Error:", e);
  process.exit(1);
});
