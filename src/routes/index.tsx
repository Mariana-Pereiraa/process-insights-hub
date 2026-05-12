import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { CircleChevronDown, RotateCcw, CheckCircle2, Search, ClipboardList, History, Pencil, Trash2, UserCog, Users, AlertTriangle } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProcesses, type ProcessStatus } from "@/data/mock-processes";
import { Button } from "@/components/ui/button";
import { processStatusOptions, analistasDisponiveis } from "@/lib/process-status";
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
const addBusinessDays = (startDate: Date, days: number) => {
  const date = new Date(startDate);
  let addedDays = 0;
  while (addedDays < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) { // 0 = Domingo, 6 = Sábado
      addedDays++;
    }
  }
  return date;
};
const getRemainingBusinessDays = (deadline: Date) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  let count = 0;
  const tempDate = new Date(hoje);

  if (tempDate > deadline) return -1; // Vencido

  while (tempDate < deadline) {
    tempDate.setDate(tempDate.getDate() + 1);
    if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
      count++;
    }
  }
  return count;
};

function Dashboard() {
  const { profile } = useProfile();
  const [filterUnidade, setFilterUnidade] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | ProcessStatus>("todos");
  useEffect(() => {
    if ((profile.role === "secgov" || profile.role === "secgov_responsavel")) {
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
  const [showDesignarAnalista, setShowDesignarAnalista] = useState(false);
const [processForAnalyst, setProcessForAnalyst] = useState<any>(null);
const [analistaSelecionado, setAnalistaSelecionado] = useState("");

// Dentro do Dashboard, antes do return:
const ajustesUrgentes = useMemo(() => {
  return mockProcesses.filter(p => p.status === "em_ajuste").map(p => {
    // Simulando que o ajuste foi solicitado na 'dataEnvioRevisao' 
    // Em um cenário real, você usaria p.dataSolicitacaoAjuste
    const [d, m, y] = p.dataEnvioRevisao.split("/");
    const dataSolicitacao = new Date(Number(y), Number(m) - 1, Number(d));
    const prazoFinal = addBusinessDays(dataSolicitacao, 15);
    const diasRestantes = getRemainingBusinessDays(prazoFinal);

    return { ...p, prazoFinal, diasRestantes };
  });
}, []);

// Define se o alerta estratégico deve aparecer (prazo <= 5 dias)
const temAjusteCritico = ajustesUrgentes.some(a => a.diasRestantes >= 0 && a.diasRestantes <= 5);

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
    (profile.role === "secgov" || profile.role === "secgov_responsavel")
      ? "Acompanhamento"
      : "Processos"
  }

/>
       <main className="flex-1 p-6 overflow-auto">
        {/* ADICIONE LOGO NO INÍCIO DO <main>, ACIMA DAS NOTIFICAÇÕES EXISTENTES */}
{temAjusteCritico && (
  <div className="mb-6 rounded-2xl border-l-4 border-l-amber-500 border border-amber-200 bg-amber-50 p-4 shadow-sm animate-pulse">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
      <div>
        <h3 className="text-sm font-bold text-amber-900">Atenção: Ajustes com Prazo Próximo</h3>
        <p className="text-xs text-amber-700 mt-1">
          Existem processos devolvidos que precisam de correção em menos de 5 dias úteis. 
          {profile.role === 'unidade' ? " Por favor, realize as alterações solicitadas." : " Acompanhe o cumprimento dos prazos pelas unidades."}
        </p>
      </div>
    </div>
  </div>
)}
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

{(profile.role === "secgov" || profile.role === "secgov_responsavel") ? (
  <>

    {/* Header da seção */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Painel de Revisão
        </h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe os processos e gerencie a equipe de análise
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Botão visível apenas para o Responsável SECGOV */}
        {profile.role === "secgov_responsavel" && (
          <Link to="/gerenciamento-analistas">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-2.5 shadow-sm gap-2">
              <Users className="w-4 h-4" />
              Gerenciamento de Analistas
            </Button>
          </Link>
        )}

        <Link to="/prazo-revisao">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 shadow-sm">
            Definir Prazo Geral
          </Button>
        </Link>
      </div>
      
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
                    <td className="px-5 py-4">
  <div className="flex flex-col gap-1">
    <StatusBadge status={process.status} />
    {process.status === "em_ajuste" && (
      <span className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
        <RotateCcw className="w-3 h-3" />
        Prazo: 15 dias úteis
      </span>
    )}
  </div>
</td>
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
                          {(profile.role === "secgov" || profile.role === "secgov_responsavel") && (
                            <>


                            {profile.role === "secgov_responsavel" && (
                              
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
        onClick={() => {
          setProcessForAnalyst(process);
          setAnalistaSelecionado(process.analistaUsername || "");
          setShowDesignarAnalista(true);
        }}
      >
        <UserCog className="w-4 h-4" />
      </Button>
    )}


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

      {showDesignarAnalista && processForAnalyst && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <UserCog className="w-5 h-5 text-violet-600" />
        <h2 className="text-lg font-bold">Designar Analista</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Processo: <strong>{processForAnalyst.nome}</strong>
      </p>

      <select
        value={analistaSelecionado}
        onChange={(e) => setAnalistaSelecionado(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm mb-5"
      >
        <option value="">— Selecione —</option>
        {analistasDisponiveis.map((a) => (
          <option key={a.username} value={a.username}>
            {a.nome} · {a.cargo}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setShowDesignarAnalista(false)}>
          Cancelar
        </Button>
        <Button
          disabled={!analistaSelecionado}
          onClick={() => {
            console.log("Atribuindo analista", analistaSelecionado, "ao processo", processForAnalyst.id);
            setShowDesignarAnalista(false);
          }}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          Confirmar
        </Button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
