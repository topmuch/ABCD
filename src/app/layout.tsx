import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ABCD Ltd | Transit, Douane & Logistique à Dakar, Sénégal",
  description:
    "African Business Company for Development (A.B.C.D Ltd) — Transit, commissionnaire en douane, transport (air, mer, route, multimodal), supply chain, entreposage et dédouanement à Dakar, Sénégal.",
  keywords: [
    "ABCD Ltd",
    "transit Dakar",
    "commissionnaire en douane Sénégal",
    "freight forwarding Dakar",
    "logistique Sénégal",
    "transport multimodal Afrique de l'Ouest",
    "dédouanement Dakar",
    "entrepôt sous douane",
    "customs broker Senegal",
  ],
  authors: [{ name: "A.B.C.D Ltd" }],
  icons: {
    icon: "/logo-abcd-transparent.png",
    apple: "/logo-abcd-transparent.png",
  },
  openGraph: {
    title: "ABCD Ltd | Transit, Douane & Logistique à Dakar",
    description:
      "Solutions sur mesure de transit, transport et logistique depuis Dakar vers l'Afrique de l'Ouest. Commissionnaire en douane agréé.",
    siteName: "A.B.C.D Ltd",
    type: "website",
    locale: "fr_SN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ABCD Ltd | Transit & Logistique à Dakar",
    description:
      "Transit, commissionnaire en douane, transport et logistique à Dakar, Sénégal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
