import { Inbox, AlertTriangle, Eye, CheckCircle2, FileSignature, Search } from "lucide-react";
import type { HistoricoEvento, HistoricoTipo } from "@/data/mock-processes";

const tipoConfig: Record<HistoricoTipo, {
  label: string;
  Icon: typeof Inbox;
  iconClass: string;
  ringClass: string;
}> = {
  criado: {
    label: "Processo criado",
    Icon: FileSignature,
    iconClass: "bg-slate-100 text-slate-700",
    ringClass: "ring-slate-200",
  },
  chegou_revisao: {
    label: "Pendente de revisão",
    Icon: Inbox,
    iconClass: "bg-blue-100 text-blue-700",
    ringClass: "ring-blue-200",
  },
  em_analise: {
    label: "Análise",
    Icon: Search,
    iconClass: "bg-indigo-100 text-indigo-700",
    ringClass: "ring-indigo-200",
  },
  ajuste_solicitado: {
    label: "Ajuste solicitado",
    Icon: AlertTriangle,
    iconClass: "bg-amber-100 text-amber-700",
    ringClass: "ring-amber-200",
  },
  revisado: {
    label: "Revisão realizada",
    Icon: Eye,
    iconClass: "bg-violet-100 text-violet-700",
    ringClass: "ring-violet-200",
  },
  concluido: {
    label: "Processo concluído",
    Icon: CheckCircle2,
    iconClass: "bg-emerald-100 text-emerald-700",
    ringClass: "ring-emerald-200",
  },
};

// Convert "dd/mm/aaaa" + "HH:MM" to a sortable timestamp
function toTimestamp(e: HistoricoEvento): number {
  const [d, m, y] = e.data.split("/").map(Number);
  const [hh, mm] = e.hora.split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0).getTime();
}

interface Props {
  eventos: HistoricoEvento[];
}

export function HistoricoTimeline({ eventos }: Props) {
  const ordered = [...eventos].sort((a, b) => toTimestamp(b) - toTimestamp(a));

  if (ordered.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Sem registros de movimentação.</p>
    );
  }

  return (
    <ol className="relative space-y-5">
      {/* vertical line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" aria-hidden />

      {ordered.map((evento, idx) => {
        const cfg = tipoConfig[evento.tipo];
        const Icon = cfg.Icon;
        const isLatest = idx === 0;

        return (
          <li key={evento.id} className="relative pl-14">
            <span
              className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-background ${cfg.iconClass} ${
                isLatest ? `ring-offset-2 ring-offset-background ${cfg.ringClass}` : ""
              }`}
            >
              <Icon className="w-5 h-5" />
            </span>

            <div
              className={`rounded-xl border p-4 transition-colors ${
                isLatest
                  ? "border-primary/30 bg-primary/5 shadow-sm"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground text-sm">{cfg.label}</h4>
                  {isLatest && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                      Atual
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {evento.data} às {evento.hora}
                </span>
              </div>

              {evento.usuario && (
                <p className="text-xs text-muted-foreground mt-1">
                  Por <span className="font-medium text-foreground">{evento.usuario}</span>
                </p>
              )}

              {evento.observacao && (
                <p className="text-sm text-foreground/80 mt-2">{evento.observacao}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
