"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  STATS,
  SERVICES,
  SERVICE_HIGHLIGHTS,
} from "@/lib/site-data";

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        id="accueil"
        className="relative w-full sm:aspect-[16/9] min-h-[480px] sm:min-h-0 sm:max-h-[78vh] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0">
          { }
          <img
            src="/hero-port.jpg"
            alt="Port de Dakar — logistique et transport maritime"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 bg-grid-navy opacity-30" />
        </div>

        <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-14">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="secondary"
                className="mb-5 bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/15"
              >
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-accent" />
                Commissionnaire en douane agréé • Dakar, Sénégal
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight"
            >
              Votre partenaire logistique
              <br />
              au cœur de l&apos;
              <span className="text-accent">Afrique de l&apos;Ouest</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 text-lg sm:text-xl text-white/85 leading-relaxed max-w-2xl"
            >
              African Business Company for Development (A.B.C.D Ltd) conçoit des
              solutions sur mesure de transit, transport et logistique — de
              l&apos;origine à la destination finale — depuis Dakar vers le Mali, la
              Guinée, la Mauritanie et au-delà.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-black/20"
              >
                <Link href="/services">
                  Découvrir nos services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/15 max-w-2xl"
            >
              {STATS.map((s) => (
                <div key={s.label} className="bg-[#0c1f4a]/60 backdrop-blur-sm p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] sm:text-sm text-white/70 leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
            {[
              "Transit & Commissionnaire en Douane agréé",
              "Transport Aérien • Maritime • Routier • Multimodal",
              "Entreposage sous douane",
              "Door-to-door vers l'Afrique de l'Ouest",
            ].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
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
                    alt="Entreposage et logistique ABCD Ltd"
                    className="w-full h-[300px] sm:h-[440px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 left-6 sm:left-10 bg-background rounded-xl shadow-lg ring-1 ring-border p-4 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Depuis le 12 janvier 2019
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dakar, Sénégal
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                  À propos d&apos;ABCD Ltd
                </Badge>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  Une expertise logistique ancrée à Dakar
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Depuis sa création le 12 janvier 2019, l&apos;activité d&apos;
                  <strong className="text-foreground">
                    African Business Company for Development SARL
                  </strong>{" "}
                  (A.B.C.D Ltd) s&apos;est construite autour du transport pour le
                  compte des compagnies maritimes de la place. Aujourd&apos;hui,
                  établissement de Transit et commissionnaire en Douane agréé,
                  ABCD Ltd étend son portefeuille d&apos;activité à l&apos;échelle
                  locale et dans les pays voisins.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Notre objectif&nbsp;: offrir une solution sur mesure à chaque
                  client, depuis l&apos;origine jusqu&apos;à la destination finale, avec
                  une approche proactive.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-7">
                  <Button asChild variant="outline">
                    <Link href="/a-propos">
                      En savoir plus sur nous <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20 sm:py-28 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                Nos services
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Un large éventail de solutions logistiques
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                Du transport multimodal au dédouanement, nous couvrons l&apos;ensemble
                de votre chaîne logistique avec des équipes spécialisées.
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.slice(0, 4).map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <Card className="group h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/80 hover:border-accent/50">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                      <s.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    <CardTitle className="mt-4 text-lg">{s.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {s.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* Image highlights */}
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {SERVICE_HIGHLIGHTS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="group relative overflow-hidden rounded-2xl ring-1 ring-border h-56">
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

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/services">
                Voir tous nos services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
              Prêt à expédier votre prochaine marchandise ?
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
              Obtenez un devis sur mesure en quelques minutes. Nos équipes vous
              répondent avec une solution adaptée à votre besoin.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                <Link href="/contact">
                  Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm">
                <Link href="/contact">Nous appeler</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
