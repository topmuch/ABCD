"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Plane,
  Ship,
  Truck,
  PackageCheck,
  Warehouse,
  FileCheck2,
  Anchor,
  Boxes,
  Globe2,
  ShieldCheck,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Send,
  Languages,
  Building2,
  Route,
  HandshakeIcon,
  Sparkles,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { href: "#accueil", label: "Accueil" },
  { href: "#apropos", label: "À propos" },
  { href: "#services", label: "Services" },
  { href: "#atouts", label: "Atouts" },
  { href: "#contact", label: "Contact" },
];

const SERVICES = [
  {
    icon: Ship,
    title: "Transport Maritime",
    desc: "Fret maritime complet, FCL/LCL, groupage et rendu destination finale pour vos marchandises vers et depuis Dakar.",
  },
  {
    icon: Plane,
    title: "Transport Aérien",
    desc: "Solutions de fret aérien express avec suivi dédié, idéal pour les colis sensibles et urgents.",
  },
  {
    icon: Truck,
    title: "Transport Routier & Multimodal",
    desc: "Acheminement terrestre et solutions multimodales door-to-door vers le Mali, la Guinée, la Mauritanie et la Gambie.",
  },
  {
    icon: FileCheck2,
    title: "Transit & Dédouanement",
    desc: "Commissionnaire en douane agréé : formalités douanières, dédouanement import/export et gestion des régimes particuliers.",
  },
  {
    icon: Warehouse,
    title: "Entreposage sous Douane",
    desc: "Stockage en magasin ou à ciel ouvert, entrepôt sous douane et gestion d'inventaire sécurisée.",
  },
  {
    icon: Boxes,
    title: "Supply Chain & Logistique",
    desc: "Optimisation globale de votre chaîne d'approvisionnement, de l'origine à la destination finale.",
  },
  {
    icon: PackageCheck,
    title: "Manutention de Colis Lourd",
    desc: "Heavy lift oncarriage : manutention et transport de colis hors gabarit avec équipements adaptés.",
  },
  {
    icon: Anchor,
    title: "Freight Forwarding",
    desc: "Organisation complète de vos flux de marchandises avec un réseau de sous-traitants agréés.",
  },
];

const COUNTRIES = [
  { name: "Sénégal", base: true },
  { name: "Mali" },
  { name: "Guinée" },
  { name: "Guinée-Bissau" },
  { name: "Mauritanie" },
  { name: "Gambie" },
];

const STATS = [
  { value: "2019", label: "Année de création", icon: Clock },
  { value: "5+", label: "Pays desservis", icon: Globe2 },
  { value: "5–20 ans", label: "Expérience des équipes", icon: Users },
  { value: "8", label: "Services spécialisés", icon: Route },
];

const WHY_US = [
  {
    icon: Sparkles,
    title: "Approche proactive",
    desc: "Une solution sur mesure à chaque client, de l'origine jusqu'à la destination finale, avec anticipation des aléas.",
  },
  {
    icon: HandshakeIcon,
    title: "Sous-traitants agréés",
    desc: "Nous collaborons avec des partenaires validés selon des cahiers des charges avec obligations de part et d'autre.",
  },
  {
    icon: ShieldCheck,
    title: "Agréé en douane",
    desc: "Établissement de Transit et commissionnaire en Douane agréé, garantissant conformité et fiabilité.",
  },
  {
    icon: Users,
    title: "Équipes confirmées",
    desc: "Des collaborateurs qualifiés capitalisant entre 5 et 20 ans d'expérience en opérations nationales et internationales.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Prise en charge",
    desc: "Analyse de votre besoin et élaboration d'une solution sur mesure, de l'origine à la destination.",
  },
  {
    step: "02",
    title: "Transit & Dédouanement",
    desc: "Gestion complète des formalités douanières et réglementaires par nos équipes agréées.",
  },
  {
    step: "03",
    title: "Transport & Manutention",
    desc: "Acheminement multimodal, manutention de colis lourds et suivi de la marchandise.",
  },
  {
    step: "04",
    title: "Livraison finale",
    desc: "Mise à disposition door-to-door avec confirmation de réception et clôture du dossier.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: section reveal                                             */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-gradient-to-b from-[#0c1f4a]/85 via-[#0c1f4a]/45 to-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <a href="#accueil" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-lg overflow-hidden bg-white p-0.5 ring-1 ring-border">
              { }
              <img
                src="/logo-abcd-transparent.png"
                alt="Logo ABCD Ltd"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className={`text-lg sm:text-xl font-extrabold tracking-tight transition-colors ${
                  scrolled ? "text-foreground" : "text-white"
                }`}
              >
                ABCD <span className="text-accent">Ltd</span>
              </span>
              <span
                className={`text-[10px] sm:text-xs font-medium tracking-wide uppercase transition-colors ${
                  scrolled ? "text-muted-foreground" : "text-white/70"
                }`}
              >
                Transit • Douane • Logistique
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-accent ${
                  scrolled
                    ? "text-foreground/80 hover:bg-secondary"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
            >
              <a href="#contact">
                Demander un devis
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              className={`lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md transition-colors ${
                scrolled
                  ? "text-foreground hover:bg-secondary"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-background border-b border-border"
          >
            <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-md text-base font-medium text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Button
                asChild
                className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a href="#contact" onClick={() => setOpen(false)}>
                  Demander un devis <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section
      id="accueil"
      className="relative w-full sm:aspect-[16/9] min-h-[480px] sm:min-h-0 sm:max-h-[78vh] flex items-center overflow-hidden"
    >
      {/* Background image (16:9) */}
      <div className="absolute inset-0">
        <img
          src="/hero-port.jpg"
          alt="Port de Dakar — logistique et transport maritime"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-grid-navy opacity-30" />
      </div>

      {/* Content */}
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
            au cœur de l'
            <span className="text-accent">Afrique de l'Ouest</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-lg sm:text-xl text-white/85 leading-relaxed max-w-2xl"
          >
            African Business Company for Development (A.B.C.D Ltd) conçoit des
            solutions sur mesure de transit, transport et logistique — de
            l'origine à la destination finale — depuis Dakar vers le Mali, la
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
              <a href="#services">
                Découvrir nos services <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm"
            >
              <a href="#contact">Nous contacter</a>
            </Button>
          </motion.div>

          {/* Mini stats */}
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
  );
}

/* ------------------------------------------------------------------ */
/*  Trust bar                                                          */
/* ------------------------------------------------------------------ */

function TrustBar() {
  const items = [
    "Transit & Commissionnaire en Douane agréé",
    "Transport Aérien • Maritime • Routier • Multimodal",
    "Entreposage sous douane",
    "Door-to-door vers l'Afrique de l'Ouest",
  ];
  return (
    <section className="border-y border-border bg-secondary/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
          {items.map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="apropos" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
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
              {/* Floating badge */}
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

          {/* Text */}
          <div>
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                À propos d'ABCD Ltd
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Une expertise logistique ancrée à Dakar
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Depuis sa création le 12 janvier 2019, l'activité d'
                <strong className="text-foreground">
                  African Business Company for Development SARL
                </strong>{" "}
                (A.B.C.D Ltd) s'est construite autour du transport pour le
                compte des compagnies maritimes de la place. Aujourd'hui,
                établissement de Transit et commissionnaire en Douane agréé,
                ABCD Ltd étend son portefeuille d'activité à l'échelle locale
                et dans les pays voisins.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Notre objectif&nbsp;: offrir une solution sur mesure à chaque
                client, depuis l'origine jusqu'à la destination finale, avec une
                approche proactive. Nous collaborons avec des sous-traitants
                agréés dans le cadre de partenariats fondés sur des cahiers des
                charges comportant des obligations de part et d'autre.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-7 space-y-3">
                {[
                  "Transit et commissionnaire en douane agréé",
                  "Solutions sur mesure de l'origine à la destination",
                  "Réseau de sous-traitants agréés et encadrés",
                  "Approche proactive et suivi dédié",
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
  );
}

/* ------------------------------------------------------------------ */
/*  Geopolitical                                                       */
/* ------------------------------------------------------------------ */

function Geopolitical() {
  return (
    <section className="py-20 sm:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-gold opacity-40" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <Badge className="mb-4 bg-white/10 text-white border border-white/20 hover:bg-white/15">
                <Globe2 className="mr-1.5 h-3.5 w-3.5 text-accent" />
                Situation géopolitique
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Dakar, hub stratégique de l'Afrique de l'Ouest
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed">
                Le Sénégal compte parmi les pays les plus stables d'Afrique de
                l'Ouest, doté d'institutions fortes. Sa position géographique et
                sa stabilité politique lui confèrent le statut de l'un des pays
                les plus industrialisés de la région.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
                De nombreuses entreprises multinationales, mixtes et privées ont
                installé leurs sièges ou bureaux régionaux à Dakar afin
                d'interagir avec les pays de la sous-région.
              </p>
            </Reveal>
          </div>

          {/* Countries */}
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
                      {c.base ? "Base" : "Desservi"}
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
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-secondary/40">
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
              Du transport multimodal au dédouanement, nous couvrons l'ensemble
              de votre chaîne logistique avec des équipes spécialisées.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
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

        {/* Highlight strip with images */}
        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {[
            { img: "/truck.jpg", title: "Transport Routier", sub: "Vers Mali, Guinée, Mauritanie, Gambie" },
            { img: "/airfreight.jpg", title: "Fret Aérien", sub: "Solutions express & suivi dédié" },
            { img: "/hero-port.jpg", title: "Fret Maritime", sub: "FCL / LCL / groupage" },
          ].map((c, i) => (
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
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Process                                                            */
/* ------------------------------------------------------------------ */

function Process() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <Reveal>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              Notre méthode
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              De l'origine à la destination finale
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Une démarche structurée et proactive pour sécuriser chacune de vos
              opérations.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {/* connector line */}
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
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why Us                                                             */
/* ------------------------------------------------------------------ */

function WhyUs() {
  return (
    <section id="atouts" className="py-20 sm:py-28 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                Nos atouts
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Des équipes confirmées, une approche sur mesure
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Nous disposons d'une équipe qualifiée et confirmée. Bon nombre
                de nos collaborateurs capitalisent entre 5 et 20 ans
                d'expérience dans des opérations de tous types, à l'échelle
                nationale et internationale.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-xl bg-background ring-1 ring-border px-5 py-4">
                  <div className="text-3xl font-extrabold text-primary">5–20</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ans d'expérience
                  </div>
                </div>
                <div className="rounded-xl bg-background ring-1 ring-border px-5 py-4">
                  <div className="text-3xl font-extrabold text-accent">100%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    approche sur mesure
                  </div>
                </div>
                <div className="rounded-xl bg-background ring-1 ring-border px-5 py-4">
                  <div className="text-3xl font-extrabold text-primary">24/7</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    réactivité
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {WHY_US.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <Card className="h-full border-border/80 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <CardContent className="pt-6">
                    <div className="h-11 w-11 rounded-lg bg-accent/15 flex items-center justify-center">
                      <w.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-foreground">
                      {w.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {w.desc}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

function FAQ() {
  const faqs = [
    {
      q: "Quels types de marchandises ABCD Ltd prend-elle en charge ?",
      a: "Nous traitons une large gamme de marchandises : conteneurisées, conventionnelles, colis lourds et hors gabarit, ainsi que les marchandises nécessitant un régime sous douane. Nos équipes adaptent les ressources à chaque type d'opération.",
    },
    {
      q: "Intervenez-vous dans les pays voisins du Sénégal ?",
      a: "Oui. Depuis Dakar, nous étendons nos opérations vers le Mali, la Guinée, la Guinée-Bissau, la Mauritanie et la Gambie, en transport routier et multimodal, avec un réseau de sous-traitants agréés.",
    },
    {
      q: "Êtes-vous agréés en tant que commissionnaire en douane ?",
      a: "Oui. ABCD Ltd est un établissement de Transit et commissionnaire en Douane agréé. Nous gérons l'ensemble des formalités douanières import/export et les régimes particuliers.",
    },
    {
      q: "Comment obtenir un devis ?",
      a: "Utilisez le formulaire de contact ci-dessous ou écrivez-nous à abcdev@gmail.com. Nos équipes vous répondront avec une proposition sur mesure dans les meilleurs délais.",
    },
  ];
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              FAQ
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Questions fréquentes
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

function Contact() {
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
    <section id="contact" className="py-20 sm:py-28 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Info */}
          <div>
            <Reveal>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                Contact
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Parlons de votre prochain envoi
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Une question, un besoin de transit, de transport ou
                d'entreposage ? Notre équipe vous répond avec une solution sur
                mesure.
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
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-[#0c1f4a] text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-lg overflow-hidden bg-white p-0.5">
                { }
                <img
                  src="/logo-abcd-transparent.png"
                  alt="Logo ABCD Ltd"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-extrabold leading-none">
                  ABCD <span className="text-accent">Ltd</span>
                </div>
                <div className="text-xs text-white/60 mt-1">
                  African Business Company for Development
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm text-white/70 leading-relaxed">
              Transit, commissionnaire en douane agréé et logistique sur mesure,
              de Dakar vers l'Afrique de l'Ouest.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/90">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-white/70 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/90">
              Services
            </h4>
            <ul className="mt-4 space-y-2.5">
              {[
                "Transport multimodal",
                "Transit & dédouanement",
                "Entreposage sous douane",
                "Supply chain",
                "Heavy lift oncarriage",
              ].map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-sm text-white/70 hover:text-accent transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/90">
              Contact
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>
                  Cité keur Gorgui, Lot 01 villa 003 Sacré Coeur, Dakar, Sénégal
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <a href="tel:+221338211131" className="hover:text-accent transition-colors">
                  +221 33 821 11 31
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <a
                  href="mailto:abcdev@gmail.com"
                  className="hover:text-accent transition-colors"
                >
                  abcdev@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/55 text-center sm:text-left">
            © {new Date().getFullYear()} African Business Company for Development
            SARL (A.B.C.D Ltd). Tous droits réservés.
          </p>
          <p className="text-xs text-white/55">
            Dakar, Sénégal — Depuis 2019
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-accent origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <About />
        <Geopolitical />
        <Services />
        <Process />
        <WhyUs />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
