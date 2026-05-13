import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Users, 
  BarChart3, 
  AlertTriangle, 
  Search,
  User,
  LayoutGrid,
  CheckCircle2,
  Eye,
  Save // Adicionado ícone de salvar
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { mockProcesses as initialProcesses } from "@/data/mock-processes";
import { analistasDisponiveis } from "@/lib/process-status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gerenciamento-analistas")({
  component: GerenciamentoAnalistas,
});

function GerenciamentoAnalistas() {
  const [processes, setProcesses] = useState(initialProcesses);
  const [searchProcesso, setSearchProcesso] = useState("");
  const [searchAnalista, setSearchAnalista] = useState("");
  
  // NOVOS ESTADOS
  const [isDirty, setIsDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAssignAnalyst = (processId: string, analystUsername: string) => {
    const selectedAnalyst = analistasDisponiveis.find(a => a.username === analystUsername);

    setProcesses(prevProcesses => 
      prevProcesses.map(p => 
        p.id === processId 
          ? { 
              ...p, 
              analistaUsername: analystUsername, 
              analistaNome: selectedAnalyst ? selectedAnalyst.nome : "" 
            } 
          : p
      )
    );
    // MARCA QUE HOUVE ALTERAÇÃO
    setIsDirty(true);
  };

  const handleConfirmSave = () => {
    // Aqui você integraria com sua API
    console.log("Dados salvos com sucesso:", processes);
    setIsDirty(false);
    setShowModal(false);
  };

  const controleAnalistas = useMemo(() => {
    const dados = analistasDisponiveis.map(analista => {
      const processosDoAnalista = processes.filter(
        p => p.analistaUsername === analista.username
      );
      const totalAtribuidos = processosDoAnalista.length;
      const totalAnalisados = processosDoAnalista.filter(p => p.status === "concluido").length;
      const ativos = totalAtribuidos - totalAnalisados;
      const status = ativos > 5 ? "critico" : ativos >= 4 ? "alerta" : "normal";
      return { ...analista, totalAtribuidos, totalAnalisados, status };
    });

    if (!searchAnalista) return dados;
    return dados.filter(a => a.nome.toLowerCase().includes(searchAnalista.toLowerCase()));
  }, [searchAnalista, processes]);

  const processosParaDistribuir = useMemo(() => {
    return processes.filter(p => {
      const estaEmAberto = p.status !== "concluido";
      const atendeBusca = p.nome.toLowerCase().includes(searchProcesso.toLowerCase());
      return estaEmAberto && atendeBusca;
    });
  }, [searchProcesso, processes]);

  return (
    <div className="flex min-h-screen w-full bg-background relative">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Gestão de Equipe" />
        
        <main className="flex-1 p-6 overflow-auto space-y-8 pb-24"> {/* padding bottom para o botão não cobrir conteúdo */}
          {/* Header */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Acompanhamento
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gerenciamento de Analistas</h1>
                <p className="text-muted-foreground text-sm">Controle a produtividade e distribuição de processos</p>
              </div>
            </div>
          </div>

          {/* TABELA 1: DISPONIBILIDADE E PRODUTIVIDADE */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/10">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-500" />
                <h2 className="font-bold text-foreground">Alocação de Analistas</h2>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar analista..."
                  value={searchAnalista}
                  onChange={(e) => setSearchAnalista(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider border-b border-border text-center">
                    <th className="px-5 py-3 text-left">Analista</th>
                    <th className="px-5 py-3">Analisados / Total</th>
                    <th className="px-5 py-3">Visualizar Processos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {controleAnalistas.map((a) => (
                    <tr key={a.username} className="hover:bg-muted/10 transition-colors text-center">
                      <td className="px-5 py-4 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                            {a.nome.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{a.nome}</div>
                            <div className="text-[10px] text-muted-foreground">{a.cargo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {a.totalAnalisados} / {a.totalAtribuidos}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link to="/$analistaId" params={{ analistaId: a.username }}>
                          <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 hover:bg-violet-50">
                            <Eye className="w-5 h-5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TABELA 2: DISTRIBUIÇÃO DE PROCESSOS */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-foreground">Distribuição de Processos</h2>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filtrar processos..."
                  value={searchProcesso}
                  onChange={(e) => setSearchProcesso(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider border-b border-border">
                    <th className="px-5 py-3 text-left">Processo</th>
                    <th className="px-5 py-3 text-left">Analista Responsável</th>
                    <th className="px-5 py-3 text-right">Atribuir/Alterar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {processosParaDistribuir.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-foreground">{p.nome}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{p.unidadeSigla}</div>
                      </td>
                      <td className="px-5 py-4">
                        {p.analistaNome ? (
                          <div className="flex items-center gap-2 text-foreground font-medium">
                            <User className="w-3.5 h-3.5 text-violet-500" />
                            {p.analistaNome}
                          </div>
                        ) : (
                          <span className="text-amber-600 text-xs flex items-center gap-1 font-medium bg-amber-50 px-2 py-0.5 rounded-md w-fit border border-amber-100">
                            <AlertTriangle className="w-3 h-3" /> Aguardando alocação
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <select 
                          className="bg-background border border-input rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-violet-500 w-full max-w-[200px] cursor-pointer"
                          value={p.analistaUsername || ""}
                          onChange={(e) => handleAssignAnalyst(p.id, e.target.value)}
                        >
                          <option value="">— Selecionar Analista —</option>
                          {analistasDisponiveis.map(a => (
                            <option key={a.username} value={a.username}>
                              {a.nome}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* BOTÃO DE CONFIRMAÇÃO FIXO (SÓ APARECE SE TIVER ALTERAÇÃO) */}
      {isDirty && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 flex justify-end z-40 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
            <p className="text-sm text-muted-foreground italic flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Você possui alterações não salvas na distribuição da equipe.
            </p>
            <Button 
              onClick={() => setShowModal(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white gap-2 px-8"
            >
              <Save className="w-4 h-4" />
              Confirmar Alocação
            </Button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-xl font-bold">Confirmar Alterações</h2>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Você está prestes a atualizar a alocação de analistas para os processos selecionados. 
              Os analistas receberão uma notificação sobre as novas atribuições.
            </p>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowModal(false)}
                className="rounded-xl px-6"
              >
                Revisar
              </Button>
              <Button 
                onClick={handleConfirmSave}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-8"
              >
                Confirmar e Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}