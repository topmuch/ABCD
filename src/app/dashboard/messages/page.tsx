"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  Search,
  RefreshCw,
  Phone,
  FileCheck2,
  ExternalLink,
  Inbox,
  Trash2,
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
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

type MessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} j`;
  return formatDate(iso);
}

export default function MessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<MessageRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/messages?${params}`);
      if (!res.ok) throw new Error("fetch failed");
      const json = await res.json();
      if (json.ok) {
        setMessages(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les messages.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, toast]);

  useEffect(() => {
    const t = setTimeout(fetchMessages, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchMessages, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = useCallback(
    async (id: string, fromModal = false) => {
      if (!confirm("Supprimer ce message ? Cette action est irréversible.")) return;
      setDeleting(true);
      try {
        const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
        const json = await res.json();
        if (json.ok) {
          toast({
            title: "Message supprimé",
            description: "Le message a été supprimé de la boîte de réception.",
          });
          // Remove from list immediately (optimistic UI)
          setMessages((prev) => prev.filter((m) => m.id !== id));
          if (fromModal) {
            setSelected(null);
          }
          setTotal((prev) => Math.max(0, prev - 1));
          // Refresh to sync pagination
          fetchMessages();
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: json.error || "Suppression impossible.",
          });
        }
      } catch {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Suppression impossible.",
        });
      } finally {
        setDeleting(false);
      }
    },
    [toast, fetchMessages]
  );

  return (
    <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Messages
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {total} demande{total > 1 ? "s" : ""} reçue{total > 1 ? "s" : ""} via le formulaire de contact
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMessages}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Boîte de réception
                <Badge variant="secondary">{total}</Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                Cliquez sur une ligne pour voir le détail
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher nom, email, sujet..."
                className="pl-8 w-full sm:w-72"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead className="min-w-[140px]">Client</TableHead>
                    <TableHead className="min-w-[180px]">Contact</TableHead>
                    <TableHead className="min-w-[140px]">Sujet</TableHead>
                    <TableHead className="min-w-[120px]">Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={5}>
                          <div className="h-5 w-full rounded bg-muted animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : messages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <Inbox className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          {search
                            ? "Aucun message ne correspond à votre recherche."
                            : "Aucun message pour le moment."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    messages.map((m) => (
                      <TableRow
                        key={m.id}
                        className="cursor-pointer"
                        onClick={() => setSelected(m)}
                      >
                        <TableCell className="font-medium text-foreground">
                          {m.name}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {m.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {m.subject ? (
                            <Badge variant="outline" className="font-normal">
                              {m.subject}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {relativeTime(m.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(m);
                              }}
                            >
                              Voir
                              <ExternalLink className="ml-1 h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(m.id);
                              }}
                              disabled={deleting}
                              title="Supprimer"
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} sur {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {selected && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-background rounded-xl shadow-2xl ring-1 ring-border w-full max-w-lg max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{selected.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selected.createdAt)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                      Fermer
                    </Button>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a href={`mailto:${selected.email}`} className="text-primary hover:underline truncate">
                        {selected.email}
                      </a>
                    </div>
                    {selected.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <a href={`tel:${selected.phone}`} className="text-primary hover:underline">
                          {selected.phone}
                        </a>
                      </div>
                    )}
                    {selected.subject && (
                      <div className="flex items-center gap-3 text-sm">
                        <FileCheck2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Badge variant="secondary">{selected.subject}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="mt-5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Message
                    </p>
                    <div className="rounded-lg bg-secondary/60 p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button asChild className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                      <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Votre demande")}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Répondre
                      </a>
                    </Button>
                    {selected.phone && (
                      <Button asChild variant="outline">
                        <a href={`tel:${selected.phone}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Appeler
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                      onClick={() => handleDelete(selected.id, true)}
                      disabled={deleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deleting ? "Suppression..." : "Supprimer"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
