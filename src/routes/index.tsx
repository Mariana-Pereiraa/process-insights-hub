import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CircleChevronDown, RotateCcw, CheckCircle2, Search, ClipboardList, History, Pencil, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProcesses, type ProcessStatus } from "@/data/mock-processes";
import { Button } from "@/components/ui/button";
import { processStatusOptions } from "@/lib/process-status";
import { useProfile } from "@/contexts/ProfileContext";

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
  const { profile } = useProfile();
  const [filterUnidade, setFilterUnidade] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | ProcessStatus>("todos");
  const [search, setSearch] = useState("");
  const [processToDelete, setProcessToDelete] = useState<string | null>(null);
  

  const unidades = useMemo(() => [...new Set(mockProcesses.map((p) => p.unidade))], []);

  const sorted = useMemo(() => {
    return [...mockProcesses].sort((a, b) => {
      // PRIORIDADE ESPECIAL:
      // Se for Gabinete do Reitor, processos em ajuste aparecem primeiro
      if (profile.role === "unidade" && profile.unidadeNome === "Gabinete do Reitor") {
        if (a.status === "em_ajuste" && b.status !== "em_ajuste") return -1;
        if (a.status !== "em_ajuste" && b.status === "em_ajuste") return 1;
      }
  
      // Depois processos em revisão
      if (a.status === "em_revisao" && b.status !== "em_revisao") return -1;
      if (a.status !== "em_revisao" && b.status === "em_revisao") return 1;
  
      // Depois ordena pelos dias desde última revisão
      return b.diasDesdeUltimaRevisao - a.diasDesdeUltimaRevisao;
    });
  }, [profile]);

  const filtered = useMemo(() => {
    return sorted.filter((p) => {
      if (filterUnidade && p.unidade !== filterUnidade) return false;
  
      if (filterStatus !== "todos" && p.status !== filterStatus) return false;
  
      if (
        search &&
        !p.nome.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
  
      return true;
    });
  }, [
    sorted,
    filterUnidade,
    filterStatus,
    search,
  ]);

  const totalRevisao = mockProcesses.filter((p) => p.status === "em_revisao").length;
  const totalConcluido = mockProcesses.filter((p) => p.status === "concluido").length;
  const totalDevolvido = mockProcesses.filter(
    (p) => p.status === "em_ajuste"
  ).length;// placeholder — sem status "devolvido" nos dados mock

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Acompanhamento" />
        <main className="flex-1 p-6 overflow-auto">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="border rounded-2xl p-6 flex items-center gap-5 border-slate-400 !bg-white">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-300">
                <CircleChevronDown className="w-7 h-7 bg-transparent text-slate-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processos aguardando revisão</p>
                <p className="text-3xl font-bold !text-black">{totalRevisao}</p>
              </div>
            </div>
            <div className="border rounded-2xl p-6 flex items-center gap-5 border-amber-400 !bg-white">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-amber-100">
                <RotateCcw className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Devolvidos para ajuste</p>
                <p className="text-3xl font-bold !text-black">{totalDevolvido}</p>
              </div>
            </div>
            <div className="border rounded-2xl p-6 flex items-center gap-5 border-emerald-400 !bg-white">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-100">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aguardando revisão anual</p>
                <p className="text-3xl font-bold !text-black">{totalConcluido}</p>
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
                {processStatusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
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
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((process) => (
                    <tr
                      key={process.id}
                      className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${
                        profile.role === "unidade" &&
                        profile.unidadeNome === "Gabinete do Reitor" &&
                        process.status === "em_ajuste"
                          ? "bg-amber-50 border-l-4 border-l-amber-500"
                          : ""
                      }`}
                    >    
                    <td className="px-5 py-4 text-sm font-medium text-foreground">{process.nome}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        <span title={process.unidade} className="border-b border-dotted border-muted-foreground/40">
                          {process.unidadeSigla}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        <span title={process.responsavel} className="border-b border-dotted border-muted-foreground/40">
                          {process.responsavelUsername}
                        </span>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={process.status} /></td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {process.dataEnvioRevisao}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">

                          {/* Histórico aparece para ambos */}
                          <Link
                            to="/historico/$processId"
                            params={{ processId: process.id }}
                          >
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <History className="w-4 h-4" />
                            </Button>
                          </Link>

                          {/* SECGOV */}
                          {profile.role === "secgov" && (
                            <Link
                              to="/revisao/$processId"
                              params={{ processId: process.id }}
                            >
                              <Button variant="outline" size="sm" className="gap-1.5">
                                <ClipboardList className="w-4 h-4" />
                                Revisar
                              </Button>
                            </Link>
                          )}

                          {/* Unidade */}
                          {profile.role === "unidade" && (
                            <>
                              <Link
                                to="/revisao/$processId"
                                params={{ processId: process.id }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Editar
                                </Button>
                              </Link>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setProcessToDelete(process.id)}
                                className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                              </Button>
                            </>
                          )}
                        </div>
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
          
          {processToDelete && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-bold mb-2">
                  Confirmar exclusão
                </h2>

                <p className="text-sm text-muted-foreground mb-6">
                  Tem certeza que deseja excluir este processo?
                  Essa ação não poderá ser desfeita.
                </p>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setProcessToDelete(null)}
                  >
                    Cancelar
                  </Button>

                  <Button
                    onClick={() => {
                      console.log("Excluir processo:", processToDelete);
                      setProcessToDelete(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Confirmar Exclusão
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
