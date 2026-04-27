import { cn } from "@/lib/utils";
import { processStatusConfig } from "@/lib/process-status";
import type { ProcessStatus } from "@/data/mock-processes";

export function StatusBadge({ status }: { status: ProcessStatus }) {
  const config = processStatusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
    dotClass: "bg-muted-foreground",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", config.className)}>
      <span className={cn("w-2 h-2 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}
