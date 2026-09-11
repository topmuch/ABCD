"use client";

import Link from "next/link";
import { ArrowRight, Clock, Globe2, Users, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader, Reveal } from "@/components/site/page-header";
import { WHY_US, STATS, FAQS } from "@/lib/site-data";
import { useLanguage } from "@/lib/i18n";

const STAT_KEYS = [
  "stat.founded",
  "stat.countries",
  "stat.experience",
  "stat.services",
];

const WHY_US_KEYS = [
  { title: "whyUs.1.title", desc: "whyUs.1.desc" },
  { title: "whyUs.2.title", desc: "whyUs.2.desc" },
  { title: "whyUs.3.title", desc: "whyUs.3.desc" },
  { title: "whyUs.4.title", desc: "whyUs.4.desc" },
];

const FAQ_KEYS = [
  { q: "faq.1.q", a: "faq.1.a" },
  { q: "faq.2.q", a: "faq.2.a" },
  { q: "faq.3.q", a: "faq.3.a" },
  { q: "faq.4.q", a: "faq.4.a" },
];

export default function AtoutsPage() {
  const { t, lang } = useLanguage();
  return (
    <>
      <PageHeader
        badge={t("atouts.badge")}
        title={t("atouts.title")}
        subtitle={t("atouts.subtitle")}
      />

      {/* Stats */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <Card className="h-full">
                  <CardContent className="pt-6 text-center">
                    <div className="h-12 w-12 rounded-xl bg-accent/15 flex items-center justify-center mx-auto mb-3">
                      <s.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-3xl font-extrabold text-primary">
                      {s.value}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {t(STAT_KEYS[i])}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why us grid */}
      <section className="py-20 sm:py-28 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                {t("atouts.whyUs.badge")}
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("atouts.whyUs.title")}
              </h2>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {WHY_US.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <Card className="h-full border-border/80 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                      <w.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {t(WHY_US_KEYS[i].title)}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {t(WHY_US_KEYS[i].desc)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* Stats inline */}
          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-wrap gap-3 justify-center">
              <div className="rounded-xl bg-background ring-1 ring-border px-5 py-4">
                <div className="text-3xl font-extrabold text-primary">5–20</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t("atouts.stat.experience")}
                </div>
              </div>
              <div className="rounded-xl bg-background ring-1 ring-border px-5 py-4">
                <div className="text-3xl font-extrabold text-accent">100%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t("atouts.stat.tailored")}
                </div>
              </div>
              <div className="rounded-xl bg-background ring-1 ring-border px-5 py-4">
                <div className="text-3xl font-extrabold text-primary">24/7</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t("atouts.stat.reactivity")}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                {t("atouts.faq.badge")}
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("atouts.faq.title")}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                    {t(FAQ_KEYS[i].q)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {t(FAQ_KEYS[i].a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-gold opacity-40" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t("atouts.cta.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
              {t("atouts.cta.desc")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
              <Link href="/contact">
                {t("atouts.cta.btn")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
