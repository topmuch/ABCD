"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Search,
  Building2,
  X,
  Calendar,
  MessageSquare,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

type AppointmentStatus = "pending" | "confirmed" | "cancelled";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string;
  status: AppointmentStatus;
  createdAt: string;
};

type StatusFilter = "all" | AppointmentStatus;

const STATUS_META: Record<
  AppointmentStatus,
  { label: string; color: string; dot: string }
> = {
  pending: {
    label: "En attente",
    color: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmé",
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Annulé",
    color: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

const FILTER_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmés" },
  { value: "cancelled", label: "Annulés" },
];

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        meta.color
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function RendezVousPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [active, setActive] = useState<Appointment | null>(null);
  const [acting, setActing] = useState<"confirm" | "cancel" | "delete" | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) {
        setAppointments(json.data as Appointment[]);
      } else {
        throw new Error(json.error || "Request failed");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les rendez-vous.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Global KPIs (always computed from the full dataset)
  const kpis = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  // Client-side filtering for the visible table
  const visible = appointments.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack = [
        a.name,
        a.email,
        a.phone,
        a.company,
        a.subject,
        a.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  async function updateStatus(id: string, status: AppointmentStatus) {
    setActing(status === "confirmed" ? "confirm" : "cancel");
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.ok) {
        // Optimistic local update
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
        setActive((prev) => (prev ? { ...prev, status } : prev));
        toast({
          title:
            status === "confirmed"
              ? "Rendez-vous confirmé"
              : "Rendez-vous annulé",
          description:
            status === "confirmed"
              ? "Le créneau a été marqué comme confirmé."
              : "Le créneau a été marqué comme annulé.",
        });
      } else {
        throw new Error(json.error || "Request failed");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Action impossible.",
      });
    } finally {
      setActing(null);
    }
  }

  async function onDelete(a: Appointment) {
    if (!confirm(`Supprimer la demande de « ${a.name} » ?`)) return;
    setActing("delete");
    try {
      const res = await fetch(`/api/appointments/${a.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.ok) {
        setAppointments((prev) => prev.filter((x) => x.id !== a.id));
        setActive(null);
        toast({
          title: "Demande supprimée",
          description: `${a.name} a été supprimée de la liste.`,
        });
      } else {
        throw new Error(json.error || "Request failed");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Suppression impossible.",
      });
    } finally {
      setActing(null);
    }
  }

  const totalCount = visible.length;

  return (
    <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Title */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Rendez-vous
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gérez les demandes de rendez-vous reçues depuis le site
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={fetchAppointments}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Actualiser
        </Button>
      </div>

      {/* KPI Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: kpis.total,
            color: "text-blue-600",
            ring: "ring-blue-200",
            bg: "bg-blue-50",
            icon: CalendarDays,
          },
          {
            label: "En attente",
            value: kpis.pending,
            color: "text-amber-600",
            ring: "ring-amber-200",
            bg: "bg-amber-50",
            icon: Clock,
          },
          {
            label: "Confirmés",
            value: kpis.confirmed,
            color: "text-emerald-600",
            ring: "ring-emerald-200",
            bg: "bg-emerald-50",
            icon: CheckCircle2,
          },
          {
            label: "Annulés",
            value: kpis.cancelled,
            color: "text-slate-500",
            ring: "ring-slate-200",
            bg: "bg-slate-50",
            icon: XCircle,
          },
        ].map((s) => (
          <Card key={s.label} className="overflow-hidden">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </p>
                  <p className={cn("mt-1 text-3xl font-extrabold", s.color)}>
                    {s.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center ring-1 shrink-0",
                    s.bg,
                    s.ring
                  )}
                >
                  <s.icon className={cn("h-4 w-4", s.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter buttons + search + table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Demandes de rendez-vous</CardTitle>
              <CardDescription className="mt-1">
                {totalCount} demande{totalCount > 1 ? "s" : ""}
                {statusFilter !== "all" &&
                  ` · ${STATUS_META[statusFilter as AppointmentStatus].label.toLowerCase()}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-8 w-full sm:w-56"
                />
              </div>
            </div>
          </div>
          {/* Status filter tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            {FILTER_TABS.map((t) => {
              const count =
                t.value === "all"
                  ? kpis.total
                  : kpis[t.value as AppointmentStatus];
              return (
                <button
                  key={t.value}
                  onClick={() => setStatusFilter(t.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    statusFilter === t.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/70 hover:text-foreground"
                  )}
                >
                  {t.label}
                  <span className="ml-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs rounded-full bg-black/10">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="max-h-[560px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead className="min-w-[180px]">Demandeur</TableHead>
                    <TableHead className="min-w-[180px]">Contact</TableHead>
                    <TableHead className="min-w-[120px]">Date souhaitée</TableHead>
                    <TableHead className="min-w-[90px]">Heure</TableHead>
                    <TableHead className="min-w-[160px]">Sujet</TableHead>
                    <TableHead className="min-w-[110px]">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <div className="h-5 w-full rounded bg-muted animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : visible.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <CalendarDays className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          {search
                            ? "Aucune demande ne correspond à votre recherche."
                            : statusFilter === "all"
                              ? "Aucune demande de rendez-vous pour le moment."
                              : `Aucune demande ${STATUS_META[statusFilter as AppointmentStatus].label.toLowerCase()}.`}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visible.map((a) => (
                      <TableRow
                        key={a.id}
                        onClick={() => setActive(a)}
                        className="cursor-pointer hover:bg-secondary/50 transition-colors"
                      >
                        <TableCell>
                          <div className="font-medium text-foreground flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                              {a.name.charAt(0).toUpperCase()}
                            </div>
                            {a.name}
                          </div>
                          {a.company && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 ml-9">
                              <Building2 className="h-3 w-3" />
                              {a.company}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground flex items-center gap-1.5 truncate max-w-[200px]">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{a.email}</span>
                          </div>
                          {a.phone && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Phone className="h-3 w-3" />
                              {a.phone}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {formatDate(a.preferredDate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {a.preferredTime ? (
                            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              {a.preferredTime}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {a.subject ? (
                            <Badge variant="outline" className="font-normal text-xs">
                              {a.subject}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={a.status} />
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setActive(a)}
                              title="Voir le détail"
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                            {a.status !== "confirmed" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateStatus(a.id, "confirmed")}
                                title="Confirmer"
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            {a.status !== "cancelled" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateStatus(a.id, "cancelled")}
                                title="Annuler"
                                className="text-amber-600 hover:text-amber-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(a)}
                              title="Supprimer"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-2xl ring-1 ring-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b border-border bg-background/95 backdrop-blur">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary text-base font-semibold flex items-center justify-center shrink-0">
                    {active.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-foreground truncate">
                      {active.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Reçue le {formatDateTime(active.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={active.status} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActive(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 space-y-5">
                {/* Coordonnées */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Coordonnées
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <a
                      href={`mailto:${active.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors"
                    >
                      <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Email</div>
                        <div className="text-sm font-medium text-foreground truncate">
                          {active.email}
                        </div>
                      </div>
                    </a>
                    {active.phone && (
                      <a
                        href={`tel:${active.phone}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors"
                      >
                        <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">Téléphone</div>
                          <div className="text-sm font-medium text-foreground truncate">
                            {active.phone}
                          </div>
                        </div>
                      </a>
                    )}
                    {active.company && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/60 sm:col-span-2">
                        <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">Société</div>
                          <div className="text-sm font-medium text-foreground truncate">
                            {active.company}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Créneau souhaité */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Créneau souhaité
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/60">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                        <Calendar className="h-3.5 w-3.5" /> Date
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {formatDate(active.preferredDate)}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/60">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                        <Clock className="h-3.5 w-3.5" /> Heure
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {active.preferredTime || "—"}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/60">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                        <User className="h-3.5 w-3.5" /> Sujet
                      </div>
                      <div className="text-sm font-medium text-foreground truncate">
                        {active.subject || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" /> Message
                  </h4>
                  <div className="p-4 rounded-lg bg-secondary/60 ring-1 ring-border text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {active.message}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="sticky bottom-0 z-10 flex flex-wrap gap-2 px-6 py-4 border-t border-border bg-background/95 backdrop-blur">
                <Button asChild variant="outline" className="gap-2">
                  <a href={`mailto:${active.email}`}>
                    <Mail className="h-4 w-4" /> Répondre par email
                  </a>
                </Button>
                {active.phone && (
                  <Button asChild variant="outline" className="gap-2">
                    <a href={`tel:${active.phone}`}>
                      <Phone className="h-4 w-4" /> Appeler
                    </a>
                  </Button>
                )}
                <div className="flex-1" />
                <Button
                  variant="outline"
                  onClick={() => onDelete(active)}
                  disabled={acting === "delete"}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="h-4 w-4" />
                  {acting === "delete" ? "Suppression..." : "Supprimer"}
                </Button>
                {active.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    onClick={() => updateStatus(active.id, "cancelled")}
                    disabled={acting === "cancel"}
                    className="gap-2 text-amber-600 hover:text-amber-700"
                  >
                    <XCircle className="h-4 w-4" />
                    {acting === "cancel" ? "..." : "Annuler"}
                  </Button>
                )}
                {active.status !== "confirmed" && (
                  <Button
                    onClick={() => updateStatus(active.id, "confirmed")}
                    disabled={acting === "confirm"}
                    className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {acting === "confirm" ? "..." : "Confirmer"}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
