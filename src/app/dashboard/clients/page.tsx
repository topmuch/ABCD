"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Globe2,
  X,
  Building2,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type Client = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  service: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

const SERVICE_OPTIONS = [
  "Transport Maritime",
  "Transport Aérien",
  "Transport Routier & Multimodal",
  "Transit & Dédouanement",
  "Entreposage sous Douane",
  "Supply Chain & Logistique",
  "Manutention de Colis Lourd",
  "Freight Forwarding",
];

const STATUS_OPTIONS = [
  { value: "prospect", label: "Prospect", color: "bg-amber-100 text-amber-700" },
  { value: "actif", label: "Actif", color: "bg-emerald-100 text-emerald-700" },
  { value: "inactif", label: "Inactif", color: "bg-slate-100 text-slate-600" },
];

const COUNTRY_OPTIONS = [
  "Sénégal", "Mali", "Guinée", "Guinée-Bissau", "Mauritanie", "Gambie", "Autre",
];

function statusBadge(status: string) {
  const s = STATUS_OPTIONS.find((o) => o.value === status);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s?.color || "bg-slate-100 text-slate-600"}`}>
      {s?.label || status}
    </span>
  );
}

export default function ClientsPage() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", country: "", service: "", status: "prospect", notes: "",
  });

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/clients?${params}`);
      const json = await res.json();
      if (json.ok) setClients(json.data);
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Chargement impossible." });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => {
    const t = setTimeout(fetchClients, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchClients, search]);

  function openAdd() {
    setEditing(null);
    setForm({ name: "", company: "", email: "", phone: "", country: "", service: "", status: "prospect", notes: "" });
    setModalOpen(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setForm({
      name: c.name, company: c.company || "", email: c.email, phone: c.phone || "",
      country: c.country || "", service: c.service || "", status: c.status, notes: c.notes || "",
    });
    setModalOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast({ variant: "destructive", title: "Champs requis", description: "Nom et email requis." });
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/clients/${editing.id}` : "/api/clients";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        toast({
          title: editing ? "Client modifié" : "Client ajouté",
          description: editing ? "Les modifications ont été enregistrées." : "Le client a été créé avec succès.",
        });
        setModalOpen(false);
        fetchClients();
      } else {
        throw new Error(json.error);
      }
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Enregistrement impossible." });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(c: Client) {
    if (!confirm(`Supprimer le client « ${c.name} » ?`)) return;
    try {
      const res = await fetch(`/api/clients/${c.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        toast({ title: "Client supprimé", description: `${c.name} a été supprimé.` });
        fetchClients();
      }
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Suppression impossible." });
    }
  }

  const stats = {
    total: clients.length,
    prospects: clients.filter((c) => c.status === "prospect").length,
    actifs: clients.filter((c) => c.status === "actif").length,
    inactifs: clients.filter((c) => c.status === "inactif").length,
  };

  return (
    <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Title */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Clients
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gérez votre portefeuille de clients
            </p>
          </div>
        </div>
        <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1.5 h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-primary" },
          { label: "Prospects", value: stats.prospects, color: "text-amber-600" },
          { label: "Actifs", value: stats.actifs, color: "text-emerald-600" },
          { label: "Inactifs", value: stats.inactifs, color: "text-slate-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <p className={`mt-1 text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Liste des clients</CardTitle>
              <CardDescription className="mt-1">{stats.total} client{stats.total > 1 ? "s" : ""}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-8 w-full sm:w-56"
                />
              </div>
              <Button variant="outline" size="icon" onClick={fetchClients} title="Actualiser">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="max-h-[560px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead className="min-w-[160px]">Client</TableHead>
                    <TableHead className="min-w-[160px]">Contact</TableHead>
                    <TableHead className="min-w-[120px]">Pays</TableHead>
                    <TableHead className="min-w-[160px]">Service</TableHead>
                    <TableHead className="min-w-[100px]">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <div className="h-5 w-full rounded bg-muted animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          {search ? "Aucun client ne correspond." : "Aucun client pour le moment."}
                        </p>
                        {!search && (
                          <Button onClick={openAdd} variant="outline" size="sm" className="mt-3">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Ajouter un client
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="font-medium text-foreground">{c.name}</div>
                          {c.company && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Building2 className="h-3 w-3" />
                              {c.company}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground flex items-center gap-1.5 truncate max-w-[180px]">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{c.email}</span>
                          </div>
                          {c.phone && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Phone className="h-3 w-3" />
                              {c.phone}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {c.country ? (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Globe2 className="h-3 w-3" />
                              {c.country}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {c.service ? (
                            <Badge variant="outline" className="font-normal text-xs">{c.service}</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">—</span>
                          )}
                        </TableCell>
                        <TableCell>{statusBadge(c.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(c)} title="Modifier">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(c)} title="Supprimer" className="text-destructive hover:text-destructive">
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

      {/* Add/Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-2xl ring-1 ring-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-foreground">
                    {editing ? "Modifier le client" : "Nouveau client"}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setModalOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <form onSubmit={onSave} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-name">Nom complet *</Label>
                      <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex : Awa Ndiaye" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-company">Société</Label>
                      <Input id="c-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Ex : SARL..." />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-email">Email *</Label>
                      <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@exemple.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-phone">Téléphone</Label>
                      <Input id="c-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+221 ..." />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-country">Pays</Label>
                      <Select value={form.country || "none"} onValueChange={(v) => setForm({ ...form, country: v === "none" ? "" : v })}>
                        <SelectTrigger id="c-country"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">—</SelectItem>
                          {COUNTRY_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-service">Service concerné</Label>
                      <Select value={form.service || "none"} onValueChange={(v) => setForm({ ...form, service: v === "none" ? "" : v })}>
                        <SelectTrigger id="c-service"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">—</SelectItem>
                          {SERVICE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-status">Statut</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger id="c-status"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-notes">Notes</Label>
                    <Textarea id="c-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Informations complémentaires..." />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" disabled={saving} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                      {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer le client"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
