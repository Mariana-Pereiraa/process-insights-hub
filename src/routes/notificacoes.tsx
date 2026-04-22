import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Inbox,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  Clock,
  Eye,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { mockNotifications, type Notification, type NotificationType } from "@/data/mock-notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notificacoes")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "Notificações — Gestão de Riscos" },
      { name: "description", content: "Central de notificações dos processos de gestão de riscos" },
    ],
  }),
});

type FilterTab = "todas" | "nao_lidas" | "lidas";

const typeConfig: Record<
  NotificationType,
  { label: string; icon: typeof Bell; iconBg: string; iconColor: string }
> = {
  chegou_revisao: {
    label: "Chegou para revisão",
    icon: Inbox,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  ajuste_solicitado: {
    label: "Ajuste solicitado",
    icon: AlertCircle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  revisado: {
    label: "Revisado",
    icon: RotateCcw,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  concluido: {
    label: "Concluído",
    icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  nova_revisao_anual: {
    label: "Nova revisão anual",
    icon: RefreshCw,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  prazo_proximo: {
    label: "Prazo próximo",
    icon: Clock,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
};

function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>(mockNotifications);
  const [tab, setTab] = useState<FilterTab>("todas");

  const naoLidas = useMemo(() => items.filter((n) => !n.lida).length, [items]);

  const filtered = useMemo(() => {
    if (tab === "nao_lidas") return items.filter((n) => !n.lida);
    if (tab === "lidas") return items.filter((n) => n.lida);
    return items;
  }, [items, tab]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const markOneRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  };

  const handleOpenProcess = (n: Notification) => {
    markOneRead(n.id);
    navigate({ to: "/historico/$processId", params: { processId: n.processId } });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Notificações" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2 -ml-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>
              {naoLidas > 0 && (
                <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
                  <CheckCheck className="w-4 h-4" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Central de Notificações</h1>
                <p className="text-sm text-muted-foreground">
                  {naoLidas > 0
                    ? `Você tem ${naoLidas} notificação${naoLidas > 1 ? "ões" : ""} não lida${naoLidas > 1 ? "s" : ""}`
                    : "Todas as notificações foram lidas"}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-5 border-b border-border">
              {[
                { key: "todas" as const, label: "Todas", count: items.length },
                { key: "nao_lidas" as const, label: "Não lidas", count: naoLidas },
                { key: "lidas" as const, label: "Lidas", count: items.length - naoLidas },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                    tab === t.key
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold",
                      tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="border border-border rounded-2xl bg-card p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Nenhuma notificação</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Quando houver novidades, elas aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((n) => {
                  const cfg = typeConfig[n.tipo];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "border rounded-2xl p-5 transition-all bg-card hover:shadow-sm",
                        !n.lida ? "border-primary/30 bg-primary/[0.02]" : "border-border"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                            cfg.iconBg
                          )}
                        >
                          <Icon className={cn("w-5 h-5", cfg.iconColor)} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-foreground">{n.titulo}</h3>
                              {!n.lida && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  Nova
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {n.data} • {n.hora}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">{n.descricao}</p>

                          <p className="text-xs font-medium text-foreground mb-3">
                            <span className="text-muted-foreground font-normal">Processo: </span>
                            {n.processoNome}
                          </p>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 h-8"
                              onClick={() => handleOpenProcess(n)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Ver processo
                            </Button>
                            {!n.lida && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 h-8 text-muted-foreground"
                                onClick={() => markOneRead(n.id)}
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Marcar como lida
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
