"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader, Reveal } from "@/components/site/page-header";
import { useLanguage } from "@/lib/i18n";
import { SERVICES, SERVICE_HIGHLIGHTS } from "@/lib/site-data";

export default function ServicesPage() {
  const { t, lang } = useLanguage();
  return (
    <>
      <PageHeader
        badge={t("section.services")}
        title={t("section.servicesTitle")}
        subtitle={t("section.servicesDesc")}
      />

      {/* Services grid with real images */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.04}>
                <Link href={`/services/${s.slug}`} className="group block h-full">
                  <Card className="group h-full overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/80 hover:border-accent/50 p-0 cursor-pointer">
                    <div className="relative h-44 overflow-hidden">
                      { }
                      <img
                        src={s.image}
                        alt={s.title}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f4a]/85 via-[#0c1f4a]/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/90 text-accent-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm">
                          <s.icon className="h-3 w-3" />
                          {t("services.service")}
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-white/70 group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                    <CardHeader className="pt-4">
                      <CardTitle className="text-lg group-hover:text-accent transition-colors">{s.title}</CardTitle>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        {s.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Image highlights */}
      <section className="py-12 sm:py-16 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {SERVICE_HIGHLIGHTS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="group relative overflow-hidden rounded-2xl ring-1 ring-border h-64">
                  { }
                  <img
                    src={c.img}
                    alt={c.title}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f4a] via-[#0c1f4a]/55 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="text-xs font-medium text-accent uppercase tracking-wide">
                      {c.sub}
                    </div>
                    <div className="mt-1 text-xl font-bold text-white">
                      {c.title}
                    </div>
                  </div>
                  <ArrowUpRight className="absolute top-4 right-4 h-5 w-5 text-white/70 group-hover:text-accent transition-colors" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Détail services */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                {t("services.offered.badge")}
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("services.offered.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                {t("services.offered.desc")}
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              t("services.list.1"),
              t("services.list.2"),
              t("services.list.3"),
              t("services.list.4"),
              t("services.list.5"),
              t("services.list.6"),
              t("services.list.7"),
              t("services.list.8"),
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 ring-1 ring-border">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/90">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-gold opacity-40" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t("services.cta.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
              {t("services.cta.desc")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
              <Link href="/contact">
                {t("section.ctaBtn")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
