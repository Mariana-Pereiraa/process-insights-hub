import type { ProcessStatus } from "@/data/mock-processes";

export const processStatusConfig: Record<
  ProcessStatus,
  { label: string; className: string; dotClass: string }
> = {
  em_revisao: {
    label: "Revisão",
    className: "bg-status-review-bg text-status-review",
    dotClass: "bg-status-review",
  },
  em_analise: {
    label: "Análise",
    className: "bg-indigo-100 text-indigo-700",
    dotClass: "bg-indigo-600",
  },
  ajuste_solicitado: {
    label: "Ajuste solicitado",
    className: "bg-amber-100 text-amber-700",
    dotClass: "bg-amber-600",
  },
  concluido: {
    label: "Concluído",
    className: "bg-status-done-bg text-status-done",
    dotClass: "bg-status-done",
  },
  em_ajuste: {
    label: "Ajuste",
    className: "bg-orange-100 text-orange-700",
    dotClass: "bg-orange-600",
  },
  em_ajuste_anual: {
    label: "Ajuste anual",
    className: "bg-orange-100 text-orange-700",
    dotClass: "bg-orange-600",
  },
  em_analise_anual: {
    label: "Análise anual",
    className: "bg-indigo-100 text-indigo-700",
    dotClass: "bg-indigo-600",
  },
  pendente_revisao_anual: {
    label: "Revisão anual",
    className: "bg-cyan-100 text-cyan-700",
    dotClass: "bg-cyan-600",
  },
  ajuste_anual_solicitado: {
    label: "Ajuste anual solicitado",
    className: "bg-rose-100 text-rose-700",
    dotClass: "bg-rose-600",
  },
};

export const processStatusOptions = Object.entries(processStatusConfig).map(
  ([value, config]) => ({
    value: value as ProcessStatus,
    label: config.label,
  }),
);
