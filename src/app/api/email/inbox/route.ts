import { NextRequest, NextResponse } from "next/server";
import { fetchInbox } from "@/lib/imap";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "20")));
    const folder = searchParams.get("folder") || "INBOX";
    const search = searchParams.get("search") || "";
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const result = await fetchInbox({ page, limit, folder, search, unreadOnly });
    return NextResponse.json({ ok: true, ...result, page, limit, folder });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    console.error("[email/inbox]", err);
    return NextResponse.json({ ok: false, error: message, emails: [], total: 0 }, { status: 500 });
  }
}
