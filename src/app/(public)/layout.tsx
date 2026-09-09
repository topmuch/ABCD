"use client";

import { motion, useScroll } from "framer-motion";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { usePageTracking } from "@/hooks/use-tracking";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollYProgress } = useScroll();
  usePageTracking();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-accent origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
