import { cn } from "@/lib/utils";
import type { ProcessStatus } from "@/data/mock-processes";

const statusConfig: Record<ProcessStatus, { label: string; className: string }> = {
  em_revisao: {
    label: "Para revisão",
    className: "bg-status-review-bg text-status-review",
  },
  concluido: {
    label: "Concluído",
    className: "bg-status-done-bg text-status-done",
  },
};

export function StatusBadge({ status }: { status: ProcessStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", config.className)}>
      <span className={cn("w-2 h-2 rounded-full", status === "em_revisao" ? "bg-status-review" : "bg-status-done")} />
      {config.label}
    </span>
  );
}
