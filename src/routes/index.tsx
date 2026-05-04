import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
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
  useEffect(() => {
    if (profile.role === "secgov") {
      setFilterStatus("em_revisao");
    } else {
      setFilterStatus("todos");
    }
  }, [profile.role]);
  const [search, setSearch] = useState("");
  const [processToDelete, setProcessToDelete] = useState<string | null>(null);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [prazoGeralRevisao, setPrazoGeralRevisao] = useState<
  { ano: string; prazo: string }[]
  >([
    {
      ano: "2026",
      prazo: "2026-05-10",
    },
  ]);
  const [novoPrazo, setNovoPrazo] = useState("");
const [novoAno, setNovoAno] = useState("");
  const [showPrazoNotification, setShowPrazoNotification] = useState(false);
  useEffect(() => {
    if (profile.role !== "secgov") {
      setShowPrazoNotification(true);
    }
  }, [profile.role]);

  const prazoMaisRecente = useMemo(() => {
    if (!prazoGeralRevisao.length) return null;
  
    return [...prazoGeralRevisao].sort(
      (a, b) => Number(b.ano) - Number(a.ano)
    )[0];
  }, [prazoGeralRevisao]);
  
  

  const unidades = useMemo(() => [...new Set(mockProcesses.map((p) => p.unidade))], []);

  const getPrazoStatus = (prazo?: string) => {
    if (!prazo) return null;
  
    const [day, month, year] = prazo.split("/");
    const prazoDate = new Date(Number(year), Number(month) - 1, Number(day));
    const hoje = new Date();
  
    const diffTime = prazoDate.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays < 0) {
      return "vencido";
    }
  
    if (diffDays <= 3) {
      return "proximo";
    }
  
    return "normal";
  };

  const sorted = useMemo(() => {
    return [...mockProcesses].sort((a, b) => {
      const parseDate = (date: string) => {
        const [day, month, year] = date.split("/");
        return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
      };
  
      return parseDate(b.dataEnvioRevisao) - parseDate(a.dataEnvioRevisao);
    });
  }, []);

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
      <Topbar
  title={
    profile.role === "secgov"
      ? "Acompanhamento"
      : "Processos"
  }
/>
       <main className="flex-1 p-6 overflow-auto">
        {showPrazoNotification &&
  profile.role !== "secgov" &&
  prazoMaisRecente && (
    <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-blue-900">
            Prazo Geral da Revisão
          </h2>

          <p
            className={`text-sm font-medium mt-1 ${
              getPrazoStatus(
                prazoMaisRecente.prazo.split("-").reverse().join("/")
              ) === "vencido"
                ? "text-red-600"
                : getPrazoStatus(
                    prazoMaisRecente.prazo.split("-").reverse().join("/")
                  ) === "proximo"
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            O prazo definido para {prazoMaisRecente.ano} é: {" "}
            {prazoMaisRecente.prazo.split("-").reverse().join("/")}
          </p>
        </div>

        <Button
          onClick={() => setShowPrazoNotification(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Entendi
        </Button>
      </div>
    </div>
)}
          {/* Summary cards */}
          {/* Substitua toda a seção de Summary cards por esta lógica */}

{/* SUBSTITUA TODA A ÁREA DOS CARDS DO SECGOV POR ESTA */}

{profile.role === "secgov" ? (
  <>
    {/* Header da seção */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Painel de Revisão
        </h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe os processos e defina o prazo geral de revisão
        </p>
      </div>

      <Link to="/prazo-revisao">
  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 shadow-sm">
    Definir Prazo Geral
  </Button>
</Link>
    </div>

    {/* Cards menores */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      
      <div className="border rounded-2xl p-4 flex items-center gap-4 border-slate-400 bg-white">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-300">
          <CircleChevronDown className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Processos aguardando revisão
          </p>
          <p className="text-2xl font-bold text-black">
            {totalRevisao}
          </p>
        </div>
      </div>

      <div className="border rounded-2xl p-4 flex items-center gap-4 border-amber-400 bg-white">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-100">
          <RotateCcw className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Devolvidos para ajuste
          </p>
          <p className="text-2xl font-bold text-black">
            {totalDevolvido}
          </p>
        </div>
      </div>

      <div className="border rounded-2xl p-4 flex items-center gap-4 border-emerald-400 bg-white">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Aguardando revisão anual
          </p>
          <p className="text-2xl font-bold text-black">
            {totalConcluido}
          </p>
        </div>
      </div>

    </div>
  </>
) : (
  /* Área para Gabinete/Reitor */
  
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <div>
      <h2 className="text-2xl font-bold text-foreground">
        Gerenciamento de Processos
      </h2>
      <p className="text-sm text-muted-foreground">
        Visualize e gerencie processos de todas as unidades
      </p>
    </div>

    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5">
      + Novo Processo
    </Button>
  </div>
)}

          {/* Filters */}
          {/* Filters */}
<div className="bg-card rounded-2xl border border-border shadow-sm">
  <div className="p-5 border-b border-border">
    <div className="flex flex-wrap items-center gap-3">
      
      {/* Busca menor */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome do processo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Data inicial */}
      <input
        type="date"
        value={dataInicial}
        onChange={(e) => setDataInicial(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {/* Data final */}
      <input
        type="date"
        value={dataFinal}
        onChange={(e) => setDataFinal(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {/* Unidade */}
      <select
  value={filterUnidade}
  onChange={(e) => setFilterUnidade(e.target.value)}
  className="w-[240px] px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
>
        <option value="">Todas as Unidades</option>
        {unidades.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={filterStatus}
        onChange={(e) =>
          setFilterStatus(e.target.value as "todos" | ProcessStatus)
        }
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
                      className="border-b border-border/50 transition-colors hover:bg-muted/30"
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

                          

                          {/* SECGOV */}
                          {profile.role === "secgov" && (
                            <>
                            <Link
                                to="/revisao/$processId"
                                params={{ processId: process.id }}
                              >
                                <Button variant="outline" size="sm" className="gap-1.5">
                                  <ClipboardList className="w-4 h-4" />
Revisar                                </Button>
                            </Link>
                            <Link
                            to="/historico/$processId"
                            params={{ processId: process.id }}
                          >
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <History className="w-4 h-4" />
                            </Button>
                          </Link>
                        
                            </>
                          )}

                          {/* Unidade */}
                          {profile.role === "unidade" && (
                            <>
                            <Link
                                to="/revisao/$processId"
                                params={{ processId: process.id }}
                              >
                                <Button variant="outline" size="sm" className="gap-1.5">
                                  <ClipboardList className="w-4 h-4" />
                                  Gerenciar Risco
                                </Button>
                            </Link>
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
                                  
                                </Button>
                              </Link>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setProcessToDelete(process.id)}
                                className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
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
