"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Lang = "fr" | "en";

type Dict = Record<string, string>;

const FR: Dict = {
  // Nav
  "nav.home": "Accueil",
  "nav.about": "À propos",
  "nav.services": "Services",
  "nav.atouts": "Atouts",
  "nav.partners": "Partenaires",
  "nav.contact": "Contact",
  // Header
  "header.getQuote": "Demander un devis",
  "header.login": "Connexion",
  // Hero
  "hero.badge": "Commissionnaire en douane agréé",
  "hero.badge.location": "Dakar, Sénégal",
  "hero.title1": "Votre partenaire",
  "hero.title2": "logistique au cœur de",
  "hero.title3": "Afrique de l'Ouest",
  "hero.desc": "ABCD Ltd conçoit des solutions sur mesure de transit, transport et logistique — de l'origine à la destination finale — depuis Dakar vers le Mali, la Guinée, la Mauritanie et au-delà.",
  "hero.cta1": "Découvrir nos services",
  "hero.cta2": "Demander un devis",
  "hero.scroll": "Défiler",
  // Trust bar
  "trust.1": "Transit & Commissionnaire en Douane agréé",
  "trust.2": "Transport Aérien • Maritime • Routier • Multimodal",
  "trust.3": "Entreposage sous douane",
  "trust.4": "Door-to-door vers l'Afrique de l'Ouest",
  // Stats
  "stat.founded": "Année de création",
  "stat.countries": "Pays desservis",
  "stat.experience": "Expérience des équipes",
  "stat.services": "Services spécialisés",
  // About
  "about.badge": "À propos d'ABCD Ltd",
  "about.title": "Une expertise logistique ancrée à Dakar",
  "about.cta": "En savoir plus sur nous",
  // Sections
  "section.services": "Nos services",
  "section.servicesTitle": "Un large éventail de solutions logistiques",
  "section.servicesDesc": "Du transport multimodal au dédouanement, nous couvrons l'ensemble de votre chaîne logistique avec des équipes spécialisées.",
  "section.servicesCta": "Voir tous nos services",
  "section.process": "Notre méthode",
  "section.processTitle": "De l'origine à la destination finale",
  "section.processDesc": "Une démarche structurée et proactive pour sécuriser chacune de vos opérations logistiques.",
  "section.whyUs": "Pourquoi nous choisir",
  "section.whyUsTitle": "Des équipes confirmées, une approche sur mesure",
  "section.whyUsDesc": "Nous disposons d'une équipe qualifiée et confirmée. Bon nombre de nos collaborateurs capitalisent entre 5 et 20 ans d'expérience dans des opérations de tous types, à l'échelle nationale et internationale.",
  "section.whyUsCta": "Découvrir nos atouts",
  "section.coverage": "Couverture géographique",
  "section.coverageTitle": "Dakar, hub stratégique de l'Afrique de l'Ouest",
  "section.ctaTitle": "Prêt à expédier votre prochaine marchandise ?",
  "section.ctaDesc": "Obtenez un devis sur mesure en quelques minutes. Nos équipes vous répondent avec une solution proactive adaptée à votre besoin.",
  "section.ctaBtn": "Demander un devis",
  "section.ctaCall": "Nous appeler",
  // Countries
  "country.base": "Base",
  "country.served": "Desservi",
  // Process steps
  "process.1": "Prise en charge",
  "process.1.desc": "Analyse & solution sur mesure",
  "process.2": "Transit & Dédouanement",
  "process.2.desc": "Formalités douanières agréées",
  "process.3": "Transport & Manutention",
  "process.3.desc": "Acheminement multimodal",
  "process.4": "Livraison finale",
  "process.4.desc": "Door-to-door confirmé",
  // Footer
  "footer.brand": "African Business Company for Development",
  "footer.desc": "Transit, commissionnaire en douane agréé et logistique sur mesure, de Dakar vers l'Afrique de l'Ouest.",
  "footer.nav": "Navigation",
  "footer.services": "Services",
  "footer.contact": "Contact",
  "footer.rights": "Tous droits réservés.",
  "footer.since": "Dakar, Sénégal — Depuis 2019",
  "footer.scan": "Scanner",
  "footer.dashboard": "Tableau de bord",
  // Contact page
  "contact.badge": "Contact",
  "contact.title": "Parlons de votre prochain envoi",
  "contact.desc": "Une question, un besoin de transit, de transport ou d'entreposage ? Notre équipe vous répond avec une solution sur mesure.",
  "contact.findUs": "Nous trouver",
  "contact.address": "Cité keur Gorgui, Sacré Coeur — Dakar",
  "contact.addressDesc": "Notre bureau est situé à Dakar. Utilisez la carte ci-dessous pour vous rendre chez nous.",
  "contact.itinerary": "Obtenir l'itinéraire",
  "contact.googleMaps": "Itinéraire Google Maps",
  "contact.openStreet": "Voir sur OpenStreetMap",
  "contact.gps": "Coordonnées GPS",
  "contact.latitude": "Latitude",
  "contact.longitude": "Longitude",
  "contact.bilingual": "Bilingue — nous accompagnons nos clients en français et en anglais.",
  "contact.formTitle": "Demande de devis",
  "contact.formDesc": "Réponse sous 24h ouvrées. Vos informations restent confidentielles.",
  "contact.name": "Nom complet",
  "contact.phone": "Téléphone",
  "contact.email": "Email",
  "contact.subject": "Sujet",
  "contact.message": "Message",
  "contact.send": "Envoyer la demande",
  "contact.sending": "Envoi en cours...",
  "contact.success": "Message envoyé",
  "contact.successDesc": "Merci ! Votre demande a bien été transmise. Nos équipes vous recontacteront rapidement.",
  "contact.error": "Erreur d'envoi",
  "contact.errorDesc": "Une erreur est survenue.",
  "contact.required": "champs requis",
  "contact.rdv": "Prendre rendez-vous",
  "contact.rdvTitle": "Demande de rendez-vous",
  "contact.rdvDesc": "Choisissez un créneau et nous vous confirmerons.",
  "contact.rdvBtn": "Demander un rendez-vous",
  // Maintenance
  "maintenance.title": "Maintenance en cours",
  "maintenance.backSoon": "Nous serons de retour bientôt",
  "maintenance.days": "Jours",
  "maintenance.hours": "Heures",
  "maintenance.minutes": "Minutes",
  "maintenance.seconds": "Secondes",
};

const EN: Dict = {
  // Nav
  "nav.home": "Home",
  "nav.about": "About",
  "nav.services": "Services",
  "nav.atouts": "Strengths",
  "nav.partners": "Partners",
  "nav.contact": "Contact",
  // Header
  "header.getQuote": "Get a quote",
  "header.login": "Login",
  // Hero
  "hero.badge": "Licensed customs broker",
  "hero.badge.location": "Dakar, Senegal",
  "hero.title1": "Your logistics partner",
  "hero.title2": "at the heart of",
  "hero.title3": "West Africa",
  "hero.desc": "ABCD Ltd designs tailored transit, transport and logistics solutions — from origin to final destination — from Dakar to Mali, Guinea, Mauritania and beyond.",
  "hero.cta1": "Discover our services",
  "hero.cta2": "Get a quote",
  "hero.scroll": "Scroll",
  // Trust bar
  "trust.1": "Licensed Transit & Customs Broker",
  "trust.2": "Air • Sea • Land • Multimodal Transport",
  "trust.3": "Bonded warehousing",
  "trust.4": "Door-to-door across West Africa",
  // Stats
  "stat.founded": "Year founded",
  "stat.countries": "Countries served",
  "stat.experience": "Team experience",
  "stat.services": "Specialized services",
  // About
  "about.badge": "About ABCD Ltd",
  "about.title": "Logistics expertise anchored in Dakar",
  "about.cta": "Learn more about us",
  // Sections
  "section.services": "Our services",
  "section.servicesTitle": "A wide range of logistics solutions",
  "section.servicesDesc": "From multimodal transport to customs clearance, we cover your entire supply chain with specialized teams.",
  "section.servicesCta": "View all services",
  "section.process": "Our method",
  "section.processTitle": "From origin to final destination",
  "section.processDesc": "A structured and proactive approach to secure each of your logistics operations.",
  "section.whyUs": "Why choose us",
  "section.whyUsTitle": "Experienced teams, a tailored approach",
  "section.whyUsDesc": "We have a qualified and proven team. Many of our collaborators capitalize on 5 to 20 years of experience in all types of operations, both nationally and internationally.",
  "section.whyUsCta": "Discover our strengths",
  "section.coverage": "Geographic coverage",
  "section.coverageTitle": "Dakar, strategic hub of West Africa",
  "section.ctaTitle": "Ready to ship your next cargo?",
  "section.ctaDesc": "Get a tailored quote in minutes. Our teams respond with a proactive solution adapted to your needs.",
  "section.ctaBtn": "Get a quote",
  "section.ctaCall": "Call us",
  // Countries
  "country.base": "Base",
  "country.served": "Served",
  // Process steps
  "process.1": "Pickup",
  "process.1.desc": "Analysis & tailored solution",
  "process.2": "Transit & Customs",
  "process.2.desc": "Licensed customs formalities",
  "process.3": "Transport & Handling",
  "process.3.desc": "Multimodal transport",
  "process.4": "Final delivery",
  "process.4.desc": "Door-to-door confirmed",
  // Footer
  "footer.brand": "African Business Company for Development",
  "footer.desc": "Transit, licensed customs broker and tailored logistics, from Dakar to West Africa.",
  "footer.nav": "Navigation",
  "footer.services": "Services",
  "footer.contact": "Contact",
  "footer.rights": "All rights reserved.",
  "footer.since": "Dakar, Senegal — Since 2019",
  "footer.scan": "Scan",
  "footer.dashboard": "Dashboard",
  // Contact page
  "contact.badge": "Contact",
  "contact.title": "Let's talk about your next shipment",
  "contact.desc": "A question, a transit, transport or warehousing need? Our team responds with a tailored solution.",
  "contact.findUs": "Find us",
  "contact.address": "SICAP Liberté 1 — Dakar",
  "contact.addressDesc": "Our office is located in Dakar. Use the map below to get to us.",
  "contact.itinerary": "Get directions",
  "contact.googleMaps": "Google Maps directions",
  "contact.openStreet": "View on OpenStreetMap",
  "contact.gps": "GPS coordinates",
  "contact.latitude": "Latitude",
  "contact.longitude": "Longitude",
  "contact.bilingual": "Bilingual — we serve our clients in French and English.",
  "contact.formTitle": "Request a quote",
  "contact.formDesc": "Response within 24 business hours. Your information remains confidential.",
  "contact.name": "Full name",
  "contact.phone": "Phone",
  "contact.email": "Email",
  "contact.subject": "Subject",
  "contact.message": "Message",
  "contact.send": "Send request",
  "contact.sending": "Sending...",
  "contact.success": "Message sent",
  "contact.successDesc": "Thank you! Your request has been submitted. Our team will get back to you shortly.",
  "contact.error": "Sending error",
  "contact.errorDesc": "An error occurred.",
  "contact.required": "required",
  "contact.rdv": "Book an appointment",
  "contact.rdvTitle": "Appointment request",
  "contact.rdvDesc": "Choose a slot and we'll confirm it.",
  "contact.rdvBtn": "Request appointment",
  // Maintenance
  "maintenance.title": "Maintenance in progress",
  "maintenance.backSoon": "We will be back soon",
  "maintenance.days": "Days",
  "maintenance.hours": "Hours",
  "maintenance.minutes": "Minutes",
  "maintenance.seconds": "Seconds",
};

const DICTS: Record<Lang, Dict> = { fr: FR, en: EN };

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "abcd-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer avoids setState-in-effect
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "fr";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "fr" || stored === "en") return stored;
    } catch {}
    return "fr";
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "fr" ? "en" : "fr";
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback((key: string) => {
    return DICTS[lang]?.[key] ?? DICTS.fr[key] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "fr" as Lang,
      setLang: () => {},
      toggleLang: () => {},
      t: (key: string) => DICTS.fr[key] ?? key,
    };
  }
  return ctx;
}
