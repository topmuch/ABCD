import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  LayoutDashboard,
  LogIn,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { NAV_LINKS, SERVICES } from "@/lib/site-data";

const SITE_URL = "https://abcdsenegal.com/";

export function SiteFooter() {
  return (
    <footer className="bg-[#0c1f4a] text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg overflow-hidden bg-white p-1">
                { }
                <img
                  src="/logo-abcd-transparent.png"
                  alt="Logo ABCD Ltd"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="text-xs text-white/60">
                African Business Company for Development
              </div>
            </div>
            <p className="mt-5 text-sm text-white/70 leading-relaxed">
              Transit, commissionnaire en douane agréé et logistique sur mesure,
              de Dakar vers l&apos;Afrique de l&apos;Ouest.
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
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
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
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-white/70 hover:text-accent transition-colors"
                  >
                    {s.title}
                  </Link>
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

          {/* QR Code (right) */}
          <div className="flex flex-col items-center lg:items-end">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/90 flex items-center gap-2">
              <QrCode className="h-4 w-4 text-accent" />
              Scanner
            </h4>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 group block rounded-xl bg-white p-3 shadow-lg ring-1 ring-white/20 hover:ring-accent/50 transition-all hover:scale-105"
              aria-label="Scanner le QR code pour visiter abcdsenegal.com"
            >
              { }
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&color=0c1f4a&bgcolor=ffffff&data=${encodeURIComponent(SITE_URL)}`}
                alt="QR code vers abcdsenegal.com"
                width={120}
                height={120}
                className="h-[120px] w-[120px]"
                loading="lazy"
              />
            </a>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-accent transition-colors"
            >
              abcdsenegal.com
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/55 text-center sm:text-left">
            © {new Date().getFullYear()} African Business Company for Development
            SARL (A.B.C.D Ltd). Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs text-white/55 hover:text-accent transition-colors inline-flex items-center gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5" />
              Connexion
            </Link>
            <Link
              href="/dashboard"
              className="text-xs text-white/55 hover:text-accent transition-colors inline-flex items-center gap-1.5"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Tableau de bord
            </Link>
            <p className="text-xs text-white/55">
              Dakar, Sénégal — Depuis 2019
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
