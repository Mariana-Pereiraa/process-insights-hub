import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  AlertTriangle,
  ClipboardList,
  History,
  ShieldAlert,
  CheckSquare,
  ListChecks,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronRight,
  Inbox,
  Eye,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  Clock,
  CalendarClock,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { HistoricoTimeline } from "@/components/HistoricoTimeline";
import { Button } from "@/components/ui/button";
import { mockProcesses, type Process } from "@/data/mock-processes";
import { mockNotifications, type NotificationType } from "@/data/mock-notifications";
import { useProfile } from "@/contexts/ProfileContext";
import { cn } from "@/lib/utils";
import { calcularPrazoAjuste, DIAS_PRAZO_AJUSTE } from "@/lib/process-status";

export const Route = createFileRoute("/unidade")({
  component: UnidadePage,
  head: () => ({
    meta: [
      { title: "Minha Unidade — Gestão de Riscos" },
      { name: "description", content: "Painel da unidade organizacional: notificações, ações pendentes e processos." },
    ],
  }),
});

const notifConfig: Record<
  NotificationType,
  { label: string; icon: typeof Bell; iconBg: string; iconColor: string }
> = {
  chegou_revisao: { label: "Chegou para revisão", icon: Inbox, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  ajuste_solicitado: { label: "Ajuste solicitado", icon: AlertCircle, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  revisado: { label: "Revisado", icon: RotateCcw, iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  concluido: { label: "Concluído", icon: CheckCircle2, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  nova_revisao_anual: { label: "Nova revisão anual", icon: RefreshCw, iconBg: "bg-sky-100", iconColor: "text-sky-600" },
  prazo_proximo: { label: "Prazo próximo", icon: Clock, iconBg: "bg-rose-100", iconColor: "text-rose-600" },
};

// Status que exigem ação do responsável da unidade
const ACTION_STATUSES = new Set([
  "ajuste_solicitado",
  "ajuste_anual_solicitado",
  "em_ajuste",
  "em_ajuste_anual",
  "pendente_revisao_anual",
]);

function UnidadePage() {
  const { profile } = useProfile();
  const [openProcessId, setOpenProcessId] = useState<string | null>(null);

  // Processos pertencentes à unidade ativa
  const meusProcessos = useMemo(
    () => mockProcesses.filter((p) => p.unidadeSigla === profile.unidadeSigla),
    [profile.unidadeSigla]
  );

  // Ações pendentes = processos com status que exigem modificação/ação da unidade
  const pendentes = useMemo(
    () => meusProcessos.filter((p) => ACTION_STATUSES.has(p.status as string)),
    [meusProcessos]
  );

  // Notificações relativas aos processos da unidade
  const minhasNotificacoes = useMemo(() => {
    const ids = new Set(meusProcessos.map((p) => p.id));
    return mockNotifications.filter((n) => ids.has(n.processId));
  }, [meusProcessos]);

  // Histórico consolidado: últimas movimentações dos processos da unidade
  const historicoConsolidado = useMemo(() => {
    return meusProcessos.flatMap((p) =>
      p.historico.map((h) => ({ ...h, processoNome: p.nome, processId: p.id }))
    );
  }, [meusProcessos]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Minha Unidade" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile.unidadeNome}</h1>
                <p className="text-sm text-muted-foreground">
                  Painel da unidade organizacional · {profile.unidadeSigla}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-700">
                    {profile.userName.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </span>
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">{profile.userName}</p>
                  <p className="text-xs text-muted-foreground">{profile.userUsername}</p>
                </div>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Processos</p>
                  <p className="text-2xl font-bold text-foreground">{meusProcessos.length}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-800" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-amber-800 font-semibold">Ações pendentes</p>
                  <p className="text-2xl font-bold text-amber-900">{pendentes.length}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-rose-700" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Notificações</p>
                  <p className="text-2xl font-bold text-foreground">
                    {minhasNotificacoes.filter((n) => !n.lida).length}
                    <span className="text-sm font-normal text-muted-foreground"> /{minhasNotificacoes.length}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Ações pendentes em destaque */}
            {pendentes.length > 0 && (
              <section className="rounded-2xl border-2 border-amber-300 bg-amber-50/60 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <h2 className="text-base font-semibold text-amber-900">Precisa da sua atenção</h2>
                </div>
                <div className="space-y-3">
                  {pendentes.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-amber-200 bg-white p-4 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-foreground truncate">{p.nome}</p>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Última movimentação:{" "}
                          {p.historico[p.historico.length - 1]?.observacao ?? "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to="/historico/$processId" params={{ processId: p.id }}>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <History className="w-4 h-4" />
                            Histórico
                          </Button>
                        </Link>
                        <Link to="/historico/$processId" params={{ processId: p.id }}>
                          <Button size="sm" className="gap-1.5 bg-amber-600 hover:bg-amber-700">
                            <ClipboardList className="w-4 h-4" />
                            Realizar ajuste
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Notificações */}
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">Central de notificações</h2>
                </div>
                <Link to="/notificacoes">
                  <Button variant="ghost" size="sm">Ver todas</Button>
                </Link>
              </div>
              {minhasNotificacoes.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Nenhuma notificação para esta unidade.
                </p>
              ) : (
                <div className="space-y-2">
                  {minhasNotificacoes.slice(0, 5).map((n) => {
                    const cfg = notifConfig[n.tipo];
                    const Icon = cfg.icon;
                    return (
                      <Link
                        key={n.id}
                        to="/historico/$processId"
                        params={{ processId: n.processId }}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-xl border transition-colors hover:bg-muted/40",
                          !n.lida ? "border-primary/30 bg-primary/[0.02]" : "border-border"
                        )}
                      >
                        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", cfg.iconBg)}>
                          <Icon className={cn("w-4 h-4", cfg.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">{n.titulo}</p>
                            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                              {n.data} • {n.hora}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{n.descricao}</p>
                          <p className="text-[11px] text-foreground/70 mt-0.5">
                            <span className="text-muted-foreground">Processo: </span>
                            {n.processoNome}
                          </p>
                        </div>
                        {!n.lida && (
                          <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Nova
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Lista de processos da unidade */}
            <section className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  Processos da unidade ({meusProcessos.length})
                </h2>
              </div>
              {meusProcessos.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10 text-center">
                  Nenhum processo cadastrado para esta unidade.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {meusProcessos.map((p) => (
                    <ProcessoCard
                      key={p.id}
                      processo={p}
                      open={openProcessId === p.id}
                      onToggle={() =>
                        setOpenProcessId((prev) => (prev === p.id ? null : p.id))
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Histórico de movimentações consolidado */}
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="w-5 h-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Histórico de movimentações</h2>
              </div>
              {historicoConsolidado.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Sem movimentações registradas.
                </p>
              ) : (
                <HistoricoTimeline eventos={historicoConsolidado} />
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProcessoCard({
  processo,
  open,
  onToggle,
}: {
  processo: Process;
  open: boolean;
  onToggle: () => void;
}) {
  const precisaAjuste = ACTION_STATUSES.has(processo.status as string);

  return (
    <div className={cn("transition-colors", open ? "bg-muted/30" : "hover:bg-muted/20")}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          {open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{processo.nome}</p>
            <p className="text-xs text-muted-foreground">
              Setor: {processo.setor} · Resp.: {processo.responsavelUsername}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {precisaAjuste && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
              <AlertTriangle className="w-3 h-3" /> Ação requerida
            </span>
          )}
          <StatusBadge status={processo.status} />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-6 pt-1 space-y-5">
          {/* Ações */}
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/historico/$processId" params={{ processId: processo.id }}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <History className="w-4 h-4" /> Ver histórico
              </Button>
            </Link>
            <Link to="/historico/$processId" params={{ processId: processo.id }}>
              <Button size="sm" className="gap-1.5">
                <Eye className="w-4 h-4" />
                {precisaAjuste ? "Realizar ajuste" : "Abrir processo"}
              </Button>
            </Link>
          </div>

          {/* Etapas */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-primary" /> Etapas do processo
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {processo.etapas.map((etapa) => (
                <div key={etapa.id} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {etapa.id}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">{etapa.titulo}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{etapa.descricao}</p>

                  {etapa.riscos && etapa.riscos.length > 0 && (
                    <SubBlock icon={ShieldAlert} title="Riscos identificados" iconClass="text-rose-600 bg-rose-100">
                      <ul className="space-y-1.5">
                        {etapa.riscos.map((r) => (
                          <li key={r.id} className="text-xs text-foreground/80">
                            <span className="font-semibold">{r.nome}</span>{" "}
                            <span className="text-muted-foreground">— {r.tipoRisco} · Nível {r.nivelRisco}</span>
                          </li>
                        ))}
                      </ul>
                    </SubBlock>
                  )}

                  {etapa.controles && etapa.controles.length > 0 && (
                    <SubBlock icon={CheckSquare} title="Avaliação / Controles" iconClass="text-blue-600 bg-blue-100">
                      <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5">
                        {etapa.controles.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </SubBlock>
                  )}

                  {etapa.respostas && etapa.respostas.length > 0 && (
                    <SubBlock icon={ListChecks} title="Resposta aos riscos" iconClass="text-violet-600 bg-violet-100">
                      <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5">
                        {etapa.respostas.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </SubBlock>
                  )}

                  {etapa.atividades && etapa.atividades.length > 0 && (
                    <SubBlock icon={CheckSquare} title="Atividades de controle" iconClass="text-emerald-600 bg-emerald-100">
                      <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5">
                        {etapa.atividades.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </SubBlock>
                  )}

                  {etapa.ocorrencias && etapa.ocorrencias.length > 0 && (
                    <SubBlock icon={AlertCircle} title="Ocorrências" iconClass="text-amber-600 bg-amber-100">
                      <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5">
                        {etapa.ocorrencias.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </SubBlock>
                  )}

                  {etapa.observacoes && (
                    <p className="text-[11px] italic text-muted-foreground mt-2">
                      Obs.: {etapa.observacoes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Histórico do processo */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-primary" /> Histórico deste processo
            </h3>
            <HistoricoTimeline eventos={processo.historico} />
          </div>
        </div>
      )}
    </div>
  );
}

function SubBlock({
  icon: Icon,
  title,
  iconClass,
  children,
}: {
  icon: typeof Bell;
  title: string;
  iconClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span className={cn("w-5 h-5 rounded-md flex items-center justify-center", iconClass)}>
          <Icon className="w-3 h-3" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground">{title}</p>
      </div>
      {children}
    </div>
  );
}
