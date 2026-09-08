"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Languages,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PageHeader, Reveal } from "@/components/site/page-header";

export default function ContactPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Merci de renseigner votre nom, votre email et votre message.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      toast({
        title: "Message envoyé",
        description:
          "Merci ! Votre demande a bien été transmise. Nos équipes vous recontacteront rapidement.",
      });
      form.reset();
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description:
          "Une erreur est survenue. Vous pouvez nous écrire directement à abcdev@gmail.com.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        badge="Contact"
        title="Parlons de votre prochain envoi"
        subtitle="Une question, un besoin de transit, de transport ou d'entreposage ? Notre équipe vous répond avec une solution sur mesure."
      />

      <section className="py-20 sm:py-28 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Info */}
            <div>
              <Reveal>
                <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                  Nos coordonnées
                </Badge>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  Joignez ABCD Ltd
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Nous sommes basés à Dakar, au cœur de Sacré Coeur. Nos équipes
                  sont disponibles pour étudier votre demande et vous proposer
                  une solution adaptée.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-8 space-y-4">
                  <a
                    href="https://maps.google.com/?q=Cité+keur+Gorgui+Sacré+Coeur+Dakar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl bg-background ring-1 ring-border hover:ring-accent/40 transition-all group"
                  >
                    <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Adresse
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        Cité keur Gorgui, Lot 01 villa 003 Sacré Coeur
                        <br />
                        Dakar, Sénégal
                      </div>
                    </div>
                  </a>

                  <a
                    href="tel:+221338211131"
                    className="flex items-start gap-4 p-4 rounded-xl bg-background ring-1 ring-border hover:ring-accent/40 transition-all group"
                  >
                    <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Téléphone
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        +221 33 821 11 31
                      </div>
                    </div>
                  </a>

                  <a
                    href="mailto:abcdev@gmail.com"
                    className="flex items-start gap-4 p-4 rounded-xl bg-background ring-1 ring-border hover:ring-accent/40 transition-all group"
                  >
                    <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Email
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        abcdev@gmail.com
                      </div>
                    </div>
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-primary text-primary-foreground">
                  <Languages className="h-5 w-5 text-accent shrink-0" />
                  <p className="text-sm">
                    <span className="font-semibold">Bilingue</span> — nous
                    accompagnons nos clients en français et en anglais.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal delay={0.1}>
              <Card className="shadow-xl border-border/80">
                <CardHeader>
                  <CardTitle className="text-xl">Demande de devis</CardTitle>
                  <CardDescription>
                    Réponse sous 24h ouvrées. Vos informations restent
                    confidentielles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Nom complet <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Votre nom"
                          autoComplete="name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+221 ..."
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="vous@exemple.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Ex : Transit import, fret maritime..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Décrivez votre besoin : nature de la marchandise, origine, destination, volume, délai..."
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
                      size="lg"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 mr-2 rounded-full border-2 border-accent-foreground/40 border-t-accent-foreground animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer la demande <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
