"use client";

import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Globe2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HandshakeIcon,
  Users,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, Reveal } from "@/components/site/page-header";
import { useLanguage } from "@/lib/i18n";
import {
  COUNTRIES,
  PROCESS,
  REFERENCES,
  WHY_US,
} from "@/lib/site-data";

export default function AProposPage() {
  const { t, lang } = useLanguage();
  return (
    <>
      <PageHeader
        badge={t("about.badge")}
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      />

      {/* Histoire */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div className="relative">
                <div className="absolute -top-4 -left-4 h-24 w-24 rounded-2xl bg-accent/20 -z-10" />
                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl bg-primary/10 -z-10" />
                <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                  { }
                  <img
                    src="/warehouse.jpg"
                    alt={t("about.story.imgAlt")}
                    className="w-full h-[300px] sm:h-[460px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 left-6 sm:left-10 bg-background rounded-xl shadow-lg ring-1 ring-border p-4 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {t("about.sinceDate")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("about.dakarSenegal")}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                  {t("about.story.badge")}
                </Badge>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  {t("about.story.title")}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {t("about.story.p1")}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {t("about.story.p2")}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {t("about.story.p3")}
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <Link
                  href="/partenaires"
                  className="mt-6 group block rounded-xl bg-secondary/60 ring-1 ring-border p-4 hover:ring-accent/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                      <HandshakeIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                        <strong className="text-foreground">{t("about.story.partnerTitle")}</strong>
                        {" — "}{t("about.story.partnerDesc")}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                        {t("about.story.partnerLink")}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
              <Reveal delay={0.3}>
                <ul className="mt-7 space-y-3">
                  {[
                    t("about.story.bullet1"),
                    t("about.story.bullet2"),
                    t("about.story.bullet3"),
                    t("about.story.bullet4"),
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Situation géopolitique */}
      <section className="py-20 sm:py-28 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-gold opacity-40" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Reveal>
                <Badge className="mb-4 bg-white/10 text-white border border-white/20 hover:bg-white/15">
                  <Globe2 className="mr-1.5 h-3.5 w-3.5 text-accent" />
                  {t("about.geopolitics.badge")}
                </Badge>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {t("about.geopolitics.title")}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed">
                  {t("about.geopolitics.p1")}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
                  {t("about.geopolitics.p2")}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                {COUNTRIES.map((c) => (
                  <div
                    key={c.name}
                    className={`rounded-xl p-5 ring-1 transition-all hover:scale-[1.02] ${
                      c.base
                        ? "bg-accent text-accent-foreground ring-accent/40 shadow-lg"
                        : "bg-white/5 text-white ring-white/15 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                        {c.base ? t("country.base") : t("country.served")}
                      </span>
                      <MapPin className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="mt-2 text-xl font-bold">{c.name}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                {t("section.process")}
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("section.processTitle")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                {t("section.processDesc")}
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-border" />
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.08}>
                <div className="relative bg-card rounded-2xl p-6 ring-1 ring-border hover:ring-accent/40 hover:shadow-lg transition-all h-full">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg shadow-md relative z-10">
                      {p.step}
                    </div>
                    <ArrowRight className="h-5 w-5 text-accent hidden lg:block" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {t(`process.${p.step}`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`process.${p.step}.desc`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Atouts preview */}
      <section className="py-20 sm:py-28 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                {t("about.atouts.badge")}
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("about.atouts.title")}
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {WHY_US.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <Card className="h-full border-border/80 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="h-11 w-11 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                      <w.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {w.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {w.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/atouts">
                {t("about.atouts.cta")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Nos références */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                <Star className="mr-1.5 h-3.5 w-3.5 text-accent" />
                {t("about.references.badge")}
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("about.references.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                {t("about.references.desc")}
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {REFERENCES.map((ref, i) => (
              <Reveal key={ref.name} delay={i * 0.06}>
                <div className="bg-white rounded-2xl ring-1 ring-border hover:ring-accent/40 hover:shadow-lg transition-all p-5 flex flex-col items-center text-center h-full">
                  <div className="h-20 w-full flex items-center justify-center">
                    <img
                      src={ref.logo}
                      alt={`Logo ${ref.name}`}
                      className="max-h-20 max-w-full object-contain"
                    />
                  </div>
                  <div className="mt-4 text-sm font-bold text-foreground">
                    {ref.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {ref.desc}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
