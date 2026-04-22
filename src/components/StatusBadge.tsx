import { cn } from "@/lib/utils";
import type { ProcessStatus } from "@/data/mock-processes";

const statusConfig: Record<ProcessStatus, { label: string; className: string; dotClass: string }> = {
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
  concluido: {
    label: "Concluído",
    className: "bg-status-done-bg text-status-done",
    dotClass: "bg-status-done",
  },
};

export function StatusBadge({ status }: { status: ProcessStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", config.className)}>
      <span className={cn("w-2 h-2 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}
