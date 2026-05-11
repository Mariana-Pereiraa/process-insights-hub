import { Link, useLocation } from "@tanstack/react-router";
import { Home, FileText, BarChart3, Building2, Users, LogOut, ShieldCheck, Inbox, UserCog } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { profile } = useProfile();

  const isSecgovLike = profile.role === "secgov" || profile.role === "secgov_responsavel";

  const navGroups = isSecgovLike
    ? [
        { label: "Início", items: [{ title: "Início", url: "/", icon: Home }] },
        { label: "Acompanhamento", items: [{ title: "Acompanhamento", url: "/", icon: ShieldCheck }] },
        { label: "Processos", items: [{ title: "Processos", url: "/processos", icon: FileText }] },
        {
          label: "Analistas",
          items: [{ title: "Responsáveis por análise", url: "/analistas", icon: UserCog }],
        },
        { label: "Relatórios", items: [{ title: "Relatórios", url: "/relatorios", icon: BarChart3 }] },
        {
          label: "Unidades",
          items: [
            { title: "Unidades", url: "/unidades", icon: Building2 },
            { title: "Usuários", url: "/usuarios", icon: Users },
          ],
        },
      ]
    : [
        { label: "Início", items: [{ title: "Início", url: "/unidade", icon: Home }] },
        { label: "Minha Unidade", items: [{ title: "Minha Unidade", url: "/unidade", icon: Inbox }] },
        { label: "Processos", items: [{ title: "Meus processos", url: "/unidade", icon: FileText }] },
      ];

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-sidebar-bg text-sidebar-foreground shrink-0">
      {/* Logo area */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="text-lg font-bold mt-2">Gestão de Riscos</h1>
        <p className="text-xs text-sidebar-foreground/60">{profile.unidadeNome}</p>
        <p className="text-xs text-sidebar-foreground/60">{profile.unidadeSigla}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = currentPath === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
