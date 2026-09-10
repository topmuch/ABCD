"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  Reply,
  Trash2,
  RefreshCw,
  Search,
  Plus,
  Paperclip,
  Inbox,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type EmailListItem = {
  uid: number;
  from: string;
  fromAddress: string;
  to: string;
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  hasAttachments: boolean;
};

type EmailAttachment = {
  filename: string;
  contentType: string;
  size: number;
};

type EmailDetail = EmailListItem & {
  bodyHtml: string;
  bodyText: string;
  attachments: EmailAttachment[];
};

const FOLDER = "INBOX";
const PAGE_SIZE = 20;

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return "à l'instant";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 o";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function textToHtml(text: string): string {
  if (!text) return "";
  return `<p>${escapeHtml(text).replace(/\n/g, "<br/>")}</p>`;
}

const EMAIL_BODY_CSS = `
.email-content p { margin: 0.5em 0; }
.email-content h1, .email-content h2, .email-content h3, .email-content h4 { font-weight: 600; margin: 0.75em 0 0.4em; line-height: 1.3; }
.email-content h1 { font-size: 1.4em; }
.email-content h2 { font-size: 1.25em; }
.email-content h3 { font-size: 1.1em; }
.email-content a { color: hsl(var(--primary)); text-decoration: underline; }
.email-content ul, .email-content ol { padding-left: 1.5em; margin: 0.5em 0; }
.email-content ul { list-style: disc; }
.email-content ol { list-style: decimal; }
.email-content img { max-width: 100%; height: auto; border-radius: 0.25rem; }
.email-content blockquote { border-left: 3px solid hsl(var(--border)); padding-left: 1em; margin: 0.5em 0; color: hsl(var(--muted-foreground)); }
.email-content table { border-collapse: collapse; width: 100%; margin: 0.5em 0; }
.email-content th, .email-content td { border: 1px solid hsl(var(--border)); padding: 0.25em 0.5em; }
.email-content pre { background: hsl(var(--secondary)); padding: 0.75em; border-radius: 0.375rem; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 0.875em; margin: 0.5em 0; white-space: pre-wrap; }
.email-content code { background: hsl(var(--secondary)); padding: 0.1em 0.3em; border-radius: 0.2rem; font-size: 0.875em; }
.email-content hr { border: none; border-top: 1px solid hsl(var(--border)); margin: 1em 0; }
.email-content b, .email-content strong { font-weight: 600; }
`;

export default function MessageriePage() {
  const { toast } = useToast();
  const [emails, setEmails] = useState<EmailListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [unreadOnly, setUnreadOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [composerOpen, setComposerOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // Composer form state
  const [formTo, setFormTo] = useState("");
  const [formCc, setFormCc] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, unreadOnly]);

  const fetchInbox = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        folder: FOLDER,
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (unreadOnly) params.set("unreadOnly", "true");

      const res = await fetch(`/api/email/inbox?${params.toString()}`);
      const json = await res.json();
      if (json.ok) {
        setEmails(Array.isArray(json.emails) ? json.emails : []);
        setTotal(Number(json.total) || 0);
        setTotalPages(
          Math.max(1, Math.ceil((Number(json.total) || 0) / PAGE_SIZE))
        );
      } else {
        setError(json.error || "Erreur lors du chargement de la boîte de réception.");
        setEmails([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch {
      setError("Impossible de contacter le serveur.");
      setEmails([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, unreadOnly]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  const selectEmail = useCallback(
    async (uid: number) => {
      setSelectedUid(uid);
      setSelectedEmail(null);
      setDetailLoading(true);
      try {
        const res = await fetch(`/api/email/${uid}?folder=${FOLDER}`);
        const json = await res.json();
        if (json.ok && json.email) {
          setSelectedEmail(json.email as EmailDetail);
          // Optimistically mark as read in the list
          setEmails((prev) =>
            prev.map((e) => (e.uid === uid ? { ...e, isRead: true } : e))
          );
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: json.error || "Impossible de charger l'email.",
          });
          setSelectedUid(null);
        }
      } catch {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger l'email.",
        });
        setSelectedUid(null);
      } finally {
        setDetailLoading(false);
      }
    },
    [toast]
  );

  const handleDelete = useCallback(async () => {
    if (!selectedUid) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/email/${selectedUid}?folder=${FOLDER}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (json.ok) {
        toast({
          title: "Email supprimé",
          description: "L'email a été supprimé de la boîte de réception.",
        });
        setSelectedUid(null);
        setSelectedEmail(null);
        fetchInbox();
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
  }, [selectedUid, toast, fetchInbox]);

  const openComposerNew = () => {
    setFormTo("");
    setFormCc("");
    setFormSubject("");
    setFormBody("");
    setComposerOpen(true);
  };

  const openComposerReply = () => {
    if (!selectedEmail) return;
    const to = selectedEmail.fromAddress || "";
    const subject = selectedEmail.subject.toLowerCase().startsWith("re:")
      ? selectedEmail.subject
      : `Re: ${selectedEmail.subject}`;
    setFormTo(to);
    setFormCc("");
    setFormSubject(subject);
    setFormBody("");
    setComposerOpen(true);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formTo.trim() || !formSubject.trim()) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Le destinataire et l'objet sont obligatoires.",
      });
      return;
    }
    setSending(true);
    try {
      const html = textToHtml(formBody);
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formTo.trim(),
          cc: formCc.trim() || undefined,
          subject: formSubject.trim(),
          html,
          text: formBody,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        toast({
          title: "Email envoyé",
          description: `Le message a bien été envoyé à ${formTo.trim()}.`,
        });
        setComposerOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Échec de l'envoi",
          description: json.error || "Erreur inconnue.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Envoi impossible.",
      });
    } finally {
      setSending(false);
    }
  };

  const closeDetail = () => {
    setSelectedUid(null);
    setSelectedEmail(null);
  };

  const unreadCount = emails.filter((e) => !e.isRead).length;

  return (
    <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Messagerie
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Boîte de réception — {total} email{total > 1 ? "s" : ""}
              {unreadCount > 0 &&
                ` · ${unreadCount} non lu${unreadCount > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInbox}
            disabled={loading}
          >
            <RefreshCw
              className={cn("mr-1.5 h-4 w-4", loading && "animate-spin")}
            />
            Actualiser
          </Button>
          <Button
            size="sm"
            onClick={openComposerNew}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Nouvel email
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <Card className="mb-4 border-amber-300 bg-amber-50 dark:border-amber-700/50 dark:bg-amber-950/30 py-0 gap-0">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Messagerie indisponible
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-0.5">
                {error}
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link href="/dashboard/email">Configurer l&apos;email</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* LEFT: list + filters */}
        <div
          className={cn(
            "lg:col-span-1 lg:block",
            selectedUid ? "hidden" : "block"
          )}
        >
          <Card className="h-full flex flex-col py-0 gap-0">
            <CardHeader className="pb-3 pt-5 space-y-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Inbox className="h-4 w-4 text-muted-foreground" />
                  Boîte de réception
                </span>
                {total > 0 && (
                  <Badge variant="secondary" className="font-normal">
                    {total}
                  </Badge>
                )}
              </CardTitle>
              {/* Filter tabs */}
              <div className="flex items-center gap-1 rounded-lg bg-secondary/60 p-1">
                <button
                  type="button"
                  onClick={() => setUnreadOnly(false)}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    !unreadOnly
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Tous
                </button>
                <button
                  type="button"
                  onClick={() => setUnreadOnly(true)}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5",
                    unreadOnly
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Non lus
                  {unreadCount > 0 && (
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                  )}
                </button>
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-8 h-9"
                />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="max-h-[60vh] lg:max-h-[calc(100vh-22rem)] overflow-y-auto">
                {loading ? (
                  <div className="p-3 space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border p-3 space-y-2"
                      >
                        <Skeleton className="h-3.5 w-2/3" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    ))}
                  </div>
                ) : emails.length === 0 ? (
                  <div className="p-8 text-center">
                    <Inbox className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {debouncedSearch
                        ? "Aucun email ne correspond à votre recherche."
                        : unreadOnly
                          ? "Aucun email non lu."
                          : "Boîte de réception vide."}
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {emails.map((email) => {
                      const isSelected = selectedUid === email.uid;
                      return (
                        <li key={email.uid}>
                          <button
                            type="button"
                            onClick={() => selectEmail(email.uid)}
                            className={cn(
                              "w-full text-left p-3 transition-colors hover:bg-secondary/60",
                              isSelected &&
                                "bg-primary/5 ring-1 ring-inset ring-primary/20",
                              !email.isRead && "bg-blue-50/40 dark:bg-blue-950/20"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className={cn(
                                  "mt-1.5 h-2 w-2 rounded-full shrink-0",
                                  email.isRead ? "bg-transparent" : "bg-blue-500"
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={cn(
                                      "text-sm truncate",
                                      email.isRead
                                        ? "font-medium text-foreground"
                                        : "font-bold text-foreground"
                                    )}
                                  >
                                    {email.from || "Inconnu"}
                                  </span>
                                  <span className="text-xs text-muted-foreground shrink-0">
                                    {relativeTime(email.date)}
                                  </span>
                                </div>
                                <p
                                  className={cn(
                                    "text-sm truncate mt-0.5",
                                    email.isRead
                                      ? "text-foreground/80"
                                      : "font-medium text-foreground"
                                  )}
                                >
                                  {email.subject || "(sans objet)"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {email.preview || "\u00A0"}
                                </p>
                                {email.hasAttachments && (
                                  <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                                    <Paperclip className="h-3 w-3" />
                                    <span>Pièce jointe</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Pagination */}
              {(totalPages > 1 || total > 0) && (
                <div className="border-t border-border p-3 flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Page {page} / {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || loading}
                      aria-label="Page précédente"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages || loading}
                      aria-label="Page suivante"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: detail panel */}
        <div
          className={cn(
            "lg:col-span-2 lg:block",
            selectedUid ? "block" : "hidden"
          )}
        >
          {/* Mobile back button */}
          {selectedUid && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mb-3"
              onClick={closeDetail}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Retour à la liste
            </Button>
          )}

          <Card className="min-h-[60vh] py-0">
            {!selectedUid ? (
              <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Mail className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-base font-medium text-foreground">
                  Sélectionnez un email
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Choisissez un message dans la liste pour afficher son contenu
                  ici.
                </p>
              </CardContent>
            ) : detailLoading ? (
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Separator />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </CardContent>
            ) : selectedEmail ? (
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-border">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 break-words">
                    {selectedEmail.subject || "(sans objet)"}
                  </h2>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {selectedEmail.from || "Inconnu"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {selectedEmail.fromAddress || "—"}
                        </p>
                        {selectedEmail.to && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            À : {selectedEmail.to}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0 mt-1">
                      {formatFullDate(selectedEmail.date)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={openComposerReply}
                      disabled={sending}
                    >
                      <Reply className="mr-1.5 h-4 w-4" />
                      Répondre
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      {deleting ? "Suppression..." : "Supprimer"}
                    </Button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 bg-secondary/20">
                  <div
                    className="email-content bg-background rounded-lg p-4 sm:p-5 ring-1 ring-border max-h-[55vh] overflow-y-auto text-foreground text-sm"
                    style={{ lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedEmail.bodyHtml ||
                        (selectedEmail.bodyText
                          ? `<pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${escapeHtml(
                              selectedEmail.bodyText
                            )}</pre>`
                          : "<p style=\"color: hsl(var(--muted-foreground)); font-style: italic;\">Aucun contenu.</p>"),
                    }}
                  />
                </div>

                {/* Attachments */}
                {selectedEmail.attachments.length > 0 && (
                  <div className="p-5 sm:p-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">
                        Pièces jointes ({selectedEmail.attachments.length})
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedEmail.attachments.map((att, i) => (
                        <li
                          key={`${att.filename}-${i}`}
                          className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground truncate">
                              {att.filename || "sans-nom"}
                            </span>
                          </div>
                          <Badge variant="secondary" className="font-normal shrink-0">
                            {formatBytes(att.size)}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            ) : null}
          </Card>
        </div>
      </div>

      {/* Composer modal */}
      <AnimatePresence>
        {composerOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !sending && setComposerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-background w-full sm:max-w-2xl sm:rounded-xl shadow-2xl ring-1 ring-border max-h-[92vh] sm:max-h-[88vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Send className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Nouvel email
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => !sending && setComposerOpen(false)}
                  disabled={sending}
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form
                onSubmit={handleSend}
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="composer-to" className="text-xs font-medium">
                    Destinataire{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="composer-to"
                    type="email"
                    value={formTo}
                    onChange={(e) => setFormTo(e.target.value)}
                    placeholder="destinataire@exemple.com"
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="composer-cc" className="text-xs font-medium">
                    Cc{" "}
                    <span className="text-muted-foreground font-normal">
                      (optionnel)
                    </span>
                  </Label>
                  <Input
                    id="composer-cc"
                    type="text"
                    value={formCc}
                    onChange={(e) => setFormCc(e.target.value)}
                    placeholder="copie@exemple.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="composer-subject"
                    className="text-xs font-medium"
                  >
                    Objet <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="composer-subject"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="Objet du message"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="composer-body"
                    className="text-xs font-medium"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="composer-body"
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    placeholder="Écrivez votre message..."
                    rows={8}
                  />
                </div>
              </form>

              <div className="flex items-center justify-end gap-2 p-4 sm:p-5 border-t border-border bg-secondary/30">
                <Button
                  variant="outline"
                  onClick={() => !sending && setComposerOpen(false)}
                  disabled={sending}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={
                    sending || !formTo.trim() || !formSubject.trim()
                  }
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-1.5 h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: EMAIL_BODY_CSS }} />
    </main>
  );
}
