import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CircleChevronDown, RotateCcw, CheckCircle2, Search, Eye } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProcesses, type ProcessStatus } from "@/data/mock-processes";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Acompanhamento — Gestão de Riscos" },
      { name: "description", content: "Painel de acompanhamento e revisão de processos de gestão de riscos" },
    ],
  }),
});

function Dashboard() {
  const [filterUnidade, setFilterUnidade] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | ProcessStatus>("todos");
  const [search, setSearch] = useState("");

  const unidades = useMemo(() => [...new Set(mockProcesses.map((p) => p.unidade))], []);

  const sorted = useMemo(() => {
    return [...mockProcesses].sort((a, b) => {
      // Pending review first, then by days since last review (desc)
      if (a.status === "em_revisao" && b.status !== "em_revisao") return -1;
      if (a.status !== "em_revisao" && b.status === "em_revisao") return 1;
      return b.diasDesdeUltimaRevisao - a.diasDesdeUltimaRevisao;
    });
  }, []);

  const filtered = useMemo(() => {
    return sorted.filter((p) => {
      if (filterUnidade && p.unidade !== filterUnidade) return false;
      if (filterStatus !== "todos" && p.status !== filterStatus) return false;
      if (search && !p.nome.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [sorted, filterUnidade, filterStatus, search]);

  const totalRevisao = mockProcesses.filter((p) => p.status === "em_revisao").length;
  const totalConcluido = mockProcesses.filter((p) => p.status === "concluido").length;
  const totalDevolvido = 0; // placeholder — sem status "devolvido" nos dados mock

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Acompanhamento" />
        <main className="flex-1 p-6 overflow-auto">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div className="border rounded-2xl p-6 flex items-center gap-5 border-slate-400 !bg-white">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-300">
                <CircleChevronDown className="w-7 h-7 bg-transparent text-slate-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processos aguardando revisão</p>
                <p className="text-3xl font-bold !text-black">{totalRevisao}</p>
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
                <CalendarDays className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revisões este mês</p>
                <p className="text-3xl font-bold text-primary">{revisoesMes}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border shadow-sm">
            <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nome do processo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <select
                value={filterUnidade}
                onChange={(e) => setFilterUnidade(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Todas as Unidades</option>
                {unidades.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "todos" | ProcessStatus)}
                className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="todos">Todos os Status</option>
                <option value="em_revisao">Revisão</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">NOME DO PROCESSO</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Unidade</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Responsável</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Envio</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((process) => (
                    <tr key={process.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-foreground">{process.nome}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{process.unidade}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{process.responsavel}</td>
                      <td className="px-5 py-4"><StatusBadge status={process.status} /></td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {process.dataEnvioRevisao}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to="/revisao/$processId"
                          params={{ processId: process.id }}
                        >
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Eye className="w-4 h-4" />
                            Revisar
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">
                        Nenhum processo encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
