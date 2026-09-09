"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  CalendarClock,
  CalendarDays,
  Eye,
  ExternalLink,
  FileText,
  Globe2,
  MessageCircle,
  Monitor,
  MousePointerClick,
  Phone,
  RefreshCw,
  Send,
  Smartphone,
  Tablet,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type StatsData = {
  ok: boolean;
  stats: {
    totalViews: number;
    viewsToday: number;
    uniqueVisitors30: number;
    totalClicks: number;
    whatsappClicks: number;
    phoneClicks: number;
    formsSent: number;
    appointments: number;
  };
  topPages: { path: string; count: number }[];
  referrers: { referrer: string; count: number }[];
  devices: { device: string; count: number }[];
  browsers: { browser: string; count: number }[];
  daily: { date: string; count: number }[];
  monthly: { month: string; count: number }[];
  generatedAt?: string;
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const NAVY = "#1e3a8a";
const GOLD = "#ca8a04";

// Multicolor palette for pie charts (navy, gold + supporting hues)
const PIE_COLORS = [
  NAVY,
  GOLD,
  "#0e7490",
  "#15803d",
  "#b45309",
  "#7c3aed",
  "#be123c",
  "#0369a1",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function deviceIcon(device: string) {
  const d = (device || "").toLowerCase();
  if (d.includes("mobile") || d.includes("phone")) return Smartphone;
  if (d.includes("tablet")) return Tablet;
  return Monitor;
}

function formatReferrer(r: string) {
  try {
    const url = new URL(r);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return r || "—";
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function StatsPage() {
  const { toast } = useToast();
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as StatsData;
      if (!json.ok) throw new Error("API error");
      setData(json);
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setError(msg);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les statistiques.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /* ---------------- KPI config ---------------- */
  const kpis = data?.stats
    ? [
        { label: "Visiteurs uniques (30j)", value: data.stats.uniqueVisitors30, icon: Users, bg: NAVY },
        { label: "Pages vues (total)", value: data.stats.totalViews, icon: Eye, bg: GOLD },
        { label: "Vues aujourd'hui", value: data.stats.viewsToday, icon: CalendarDays, bg: NAVY },
        { label: "Formulaires envoyés", value: data.stats.formsSent, icon: Send, bg: GOLD },
        { label: "Demandes de RDV", value: data.stats.appointments, icon: CalendarClock, bg: NAVY },
        { label: "Clics WhatsApp", value: data.stats.whatsappClicks, icon: MessageCircle, bg: GOLD },
        { label: "Clics téléphone", value: data.stats.phoneClicks, icon: Phone, bg: NAVY },
        { label: "Total clics", value: data.stats.totalClicks, icon: MousePointerClick, bg: GOLD },
      ]
    : [];

  const tooltipStyle = {
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    fontSize: "0.875rem",
  };

  return (
    <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* ---------------- Header ---------------- */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Statistiques
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Dernière mise à jour :{" "}
              {loading ? "Chargement…" : formatDateTime(data?.generatedAt)}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchStats} disabled={refreshing}>
          <RefreshCw
            className={`mr-1.5 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Actualiser
        </Button>
      </div>

      {/* ---------------- Error banner ---------------- */}
      {error && !loading && (
        <Card className="mb-6 border-destructive/40 bg-destructive/5">
          <CardContent className="py-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-destructive">
                Impossible de charger les statistiques
              </p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ---------------- KPI cards ---------------- */}
      <section className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6 pb-6">
                    <div className="h-4 w-2/3 rounded bg-muted animate-pulse mb-3" />
                    <div className="h-8 w-1/2 rounded bg-muted animate-pulse" />
                  </CardContent>
                </Card>
              ))
            : kpis.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Card
                      className="overflow-hidden border-0 text-white shadow-md hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: kpi.bg }}
                    >
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium text-white/80 uppercase tracking-wide">
                              {kpi.label}
                            </p>
                            <p className="mt-2 text-3xl font-extrabold tracking-tight">
                              {kpi.value.toLocaleString("fr-FR")}
                            </p>
                          </div>
                          <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
        </div>
      </section>

      {/* ---------------- Row 1: Area + Devices pie ---------------- */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" style={{ color: NAVY }} />
                Évolution des visites (7 derniers jours)
              </CardTitle>
              <CardDescription>Nombre de pages vues par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                {loading ? (
                  <div className="h-full w-full rounded bg-muted animate-pulse" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data?.daily || []}
                      margin={{ top: 10, right: 16, left: -16, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={NAVY} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={NAVY} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ fontWeight: 600 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        name="Vues"
                        stroke={NAVY}
                        strokeWidth={2.5}
                        fill="url(#colorViews)"
                        dot={{ r: 4, fill: NAVY, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Monitor className="h-5 w-5" style={{ color: GOLD }} />
                Appareils utilisés
              </CardTitle>
              <CardDescription>Répartition par type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full">
                {loading ? (
                  <div className="h-full w-full rounded bg-muted animate-pulse" />
                ) : (data?.devices || []).length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    Aucune donnée
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.devices || []}
                        dataKey="count"
                        nameKey="device"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {(data?.devices || []).map((entry, index) => (
                          <Cell
                            key={`cell-dev-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(data?.devices || []).map((d, i) => {
                  const Icon = deviceIcon(d.device);
                  return (
                    <div
                      key={d.device || `dev-${i}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate capitalize">{d.device || "Inconnu"}</span>
                      <span className="ml-auto font-medium text-foreground">{d.count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* ---------------- Row 2: Top pages bar + Browsers pie ---------------- */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" style={{ color: GOLD }} />
                Pages les plus consultées
              </CardTitle>
              <CardDescription>Top 10 des pages vues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                {loading ? (
                  <div className="h-full w-full rounded bg-muted animate-pulse" />
                ) : (data?.topPages || []).length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    Aucune donnée
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={(data?.topPages || []).map((p) => ({
                        name: p.path,
                        count: p.count,
                      }))}
                      layout="vertical"
                      margin={{ top: 0, right: 16, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "#475569" }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        cursor={{ fill: "#f1f5f9" }}
                      />
                      <Bar
                        dataKey="count"
                        name="Vues"
                        fill={GOLD}
                        radius={[0, 6, 6, 0]}
                        barSize={18}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe2 className="h-5 w-5" style={{ color: NAVY }} />
                Navigateurs
              </CardTitle>
              <CardDescription>Répartition par navigateur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full">
                {loading ? (
                  <div className="h-full w-full rounded bg-muted animate-pulse" />
                ) : (data?.browsers || []).length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    Aucune donnée
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.browsers || []}
                        dataKey="count"
                        nameKey="browser"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {(data?.browsers || []).map((entry, index) => (
                          <Cell
                            key={`cell-brw-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(data?.browsers || []).map((b, i) => (
                  <div
                    key={b.browser || `brw-${i}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="truncate">{b.browser || "Inconnu"}</span>
                    <span className="ml-auto font-medium text-foreground">{b.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* ---------------- Row 3: Monthly bar ---------------- */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" style={{ color: NAVY }} />
              Visites mensuelles (6 mois)
            </CardTitle>
            <CardDescription>Évolution mensuelle des pages vues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              {loading ? (
                <div className="h-full w-full rounded bg-muted animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.monthly || []}
                    margin={{ top: 10, right: 16, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      cursor={{ fill: "#f1f5f9" }}
                    />
                    <Bar
                      dataKey="count"
                      name="Vues"
                      fill={NAVY}
                      radius={[6, 6, 0, 0]}
                      barSize={42}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ---------------- Row 4: Two tables ---------------- */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ExternalLink className="h-5 w-5" style={{ color: GOLD }} />
              Sources du trafic
            </CardTitle>
            <CardDescription>Origines des visiteurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right w-24">Visites</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={2}>
                          <div className="h-5 w-full rounded bg-muted animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (data?.referrers || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-sm text-muted-foreground">
                        Aucune source enregistrée
                      </TableCell>
                    </TableRow>
                  ) : (
                    (data?.referrers || []).map((r, i) => (
                      <TableRow key={`ref-${i}`}>
                        <TableCell className="text-sm text-foreground truncate max-w-[280px]">
                          {formatReferrer(r.referrer)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="font-mono">
                            {r.count}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" style={{ color: GOLD }} />
              Pages consultées
            </CardTitle>
            <CardDescription>Pages les plus visitées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className="text-right w-24">Vues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={2}>
                          <div className="h-5 w-full rounded bg-muted animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (data?.topPages || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-sm text-muted-foreground">
                        Aucune page enregistrée
                      </TableCell>
                    </TableRow>
                  ) : (
                    (data?.topPages || []).map((p, i) => (
                      <TableRow key={`pg-${i}`}>
                        <TableCell className="text-sm text-foreground truncate max-w-[280px]">
                          {p.path}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="font-mono">
                            {p.count}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}
