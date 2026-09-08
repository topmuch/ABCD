import {
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
  Route,
  HandshakeIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type NavLink = { href: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/atouts", label: "Atouts" },
  { href: "/contact", label: "Contact" },
];

export type Service = {
  icon: LucideIcon;
  title: string;
  desc: string;
  image: string;
};

export const SERVICES: Service[] = [
  {
    icon: Ship,
    title: "Transport Maritime",
    desc: "Fret maritime complet, FCL/LCL, groupage et rendu destination finale pour vos marchandises vers et depuis Dakar.",
    image: "/svc-maritime.jpg",
  },
  {
    icon: Plane,
    title: "Transport Aérien",
    desc: "Solutions de fret aérien express avec suivi dédié, idéal pour les colis sensibles et urgents.",
    image: "/svc-aerien.jpg",
  },
  {
    icon: Truck,
    title: "Transport Routier & Multimodal",
    desc: "Acheminement terrestre et solutions multimodales door-to-door vers le Mali, la Guinée, la Mauritanie et la Gambie.",
    image: "/svc-routier.jpg",
  },
  {
    icon: FileCheck2,
    title: "Transit & Dédouanement",
    desc: "Commissionnaire en douane agréé : formalités douanières, dédouanement import/export et gestion des régimes particuliers.",
    image: "/svc-transit.jpg",
  },
  {
    icon: Warehouse,
    title: "Entreposage sous Douane",
    desc: "Stockage en magasin ou à ciel ouvert, entrepôt sous douane et gestion d'inventaire sécurisée.",
    image: "/svc-entrepot.jpg",
  },
  {
    icon: Boxes,
    title: "Supply Chain & Logistique",
    desc: "Optimisation globale de votre chaîne d'approvisionnement, de l'origine à la destination finale.",
    image: "/svc-supplychain.jpg",
  },
  {
    icon: PackageCheck,
    title: "Manutention de Colis Lourd",
    desc: "Heavy lift oncarriage : manutention et transport de colis hors gabarit avec équipements adaptés.",
    image: "/svc-colislourd.jpg",
  },
  {
    icon: Anchor,
    title: "Freight Forwarding",
    desc: "Organisation complète de vos flux de marchandises avec un réseau de sous-traitants agréés.",
    image: "/svc-freight.jpg",
  },
];

export const SERVICE_HIGHLIGHTS = [
  {
    img: "/truck.jpg",
    title: "Transport Routier",
    sub: "Vers Mali, Guinée, Mauritanie, Gambie",
  },
  {
    img: "/airfreight.jpg",
    title: "Fret Aérien",
    sub: "Solutions express & suivi dédié",
  },
  {
    img: "/hero-port.jpg",
    title: "Fret Maritime",
    sub: "FCL / LCL / groupage",
  },
];

export type Country = { name: string; base?: boolean };

export const COUNTRIES: Country[] = [
  { name: "Sénégal", base: true },
  { name: "Mali" },
  { name: "Guinée" },
  { name: "Guinée-Bissau" },
  { name: "Mauritanie" },
  { name: "Gambie" },
];

export type Stat = { value: string; label: string; icon: LucideIcon };

export const STATS: Stat[] = [
  { value: "2019", label: "Année de création", icon: Clock },
  { value: "5+", label: "Pays desservis", icon: Globe2 },
  { value: "5–20 ans", label: "Expérience des équipes", icon: Users },
  { value: "8", label: "Services spécialisés", icon: Route },
];

export type Atout = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export const WHY_US: Atout[] = [
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

export type ProcessStep = { step: string; title: string; desc: string };

export const PROCESS: ProcessStep[] = [
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

export const FAQS = [
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
    a: "Utilisez le formulaire de contact de la page Contact ou écrivez-nous à abcdev@gmail.com. Nos équipes vous répondront avec une proposition sur mesure dans les meilleurs délais.",
  },
];
