import { Bell, Menu, User, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { mockNotifications } from "@/data/mock-notifications";
import { useProfile, PROFILES, type ProfileRole } from "@/contexts/ProfileContext";

interface TopbarProps {
  title: string;
  onToggleSidebar?: () => void;
}

export function Topbar({ title, onToggleSidebar }: TopbarProps) {
  const unreadCount = mockNotifications.filter((n) => !n.lida).length;
  const { profile, setRole } = useProfile();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const roles: ProfileRole[] = ["secgov", "secgov_responsavel", "unidade"];

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="text-muted-foreground hover:text-foreground transition-colors lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/notificacoes"
          aria-label="Notificações"
          className="relative text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-[10px] font-bold rounded-full flex items-center justify-center text-white bg-red-600">
              {unreadCount}
            </span>
          )}
        </Link>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium text-foreground">{profile.userName}</span>
              <span className="text-[11px] text-muted-foreground">{profile.unidadeSigla}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Trocar perfil
                </p>
              </div>
              {roles.map((r) => {
                const p = PROFILES[r];
                const active = r === profile.role;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-start gap-3 ${
                      active ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      r === "secgov"
                        ? "bg-blue-100 text-blue-700"
                        : r === "secgov_responsavel"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {r === "secgov_responsavel" ? "RESP" : p.unidadeSigla}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{p.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.userName}</p>
                    </div>
                    {active && (
                      <span className="text-[10px] font-bold uppercase text-primary mt-1">Ativo</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
