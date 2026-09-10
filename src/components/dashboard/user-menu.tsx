"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

function initials(name: string | null, email: string) {
  const base = name || email;
  return base
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.user) setUser(d.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Full page navigation to ensure session cookie is cleared and middleware re-checks
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="px-3 py-3">
        <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-3 py-2">
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href="/login">Connexion</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-3 py-2.5">
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-secondary/60">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-semibold">
            {initials(user.name, user.email)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-foreground truncate">
            {user.name || user.email}
          </div>
          <div className="text-[10px] text-muted-foreground truncate">
            {user.email}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={loggingOut}
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loggingOut ? "Déconnexion..." : "Se déconnecter"}
    </Button>
  );
}
