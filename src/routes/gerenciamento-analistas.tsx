import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Users, 
  BarChart3, 
  AlertTriangle, 
  Search,
  User,
  LayoutGrid // Adicionado aqui
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { mockProcesses as initialProcesses } from "@/data/mock-processes";
import { analistasDisponiveis } from "@/lib/process-status";

export const Route = createFileRoute("/gerenciamento-analistas")({
  component: GerenciamentoAnalistas,
});

function GerenciamentoAnalistas() {
  // 1. Transformamos os processos em estado para permitir mudanças dinâmicas
  const [processes, setProcesses] = useState(initialProcesses);
  const [searchProcesso, setSearchProcesso] = useState("");
  const [searchAnalista, setSearchAnalista] = useState("");

  // Função para lidar com a troca de analista
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
  };

  // 2. Cálculo da Carga de Trabalho - agora depende do estado 'processes'
  const cargaTrabalho = useMemo(() => {
    const dados = analistasDisponiveis.map(analista => {
      // Filtra processos ativos baseados no estado atual
      const processosAtivos = processes.filter(
        p => p.analistaUsername === analista.username && p.status !== "concluido"
      );
      
      const count = processosAtivos.length;
      const status = count > 5 ? "critico" : count >= 4 ? "alerta" : "normal";
      
      return { ...analista, count, status };
    });

    if (!searchAnalista) return dados;
    return dados.filter(a => a.nome.toLowerCase().includes(searchAnalista.toLowerCase()));
  }, [searchAnalista, processes]); // Recalcula se processes mudar

  // 3. Processos para distribuir - agora depende do estado 'processes'
  const processosParaDistribuir = useMemo(() => {
    return processes.filter(p => {
      const estaEmAberto = p.status !== "concluido";
      const atendeBusca = p.nome.toLowerCase().includes(searchProcesso.toLowerCase());
      return estaEmAberto && atendeBusca;
    });
  }, [searchProcesso, processes]); // Recalcula se processes mudar

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Gestão de Equipe" />
        
        <main className="flex-1 p-6 overflow-auto space-y-8">
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
                <p className="text-muted-foreground text-sm">Monitore a carga de trabalho e distribua processos</p>
              </div>
            </div>
          </div>

          {/* TABELA 1: DISPONIBILIDADE DA EQUIPE */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/10">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-500" />
                <h2 className="font-bold text-foreground">Disponibilidade da Equipe</h2>
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
                  <tr className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider border-b border-border">
                    <th className="px-5 py-3 text-left">Analista</th>
                    <th className="px-5 py-3 text-left">Processos Ativos</th>
                    <th className="px-5 py-3 text-left">Carga Visual</th>
                    <th className="px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cargaTrabalho.map((a) => (
                    <tr key={a.username} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-4">
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
                      <td className="px-5 py-4 font-semibold">
                        {a.count} <span className="text-muted-foreground font-normal text-xs">/ 6 máx.</span>
                      </td>
                      <td className="px-5 py-4 min-w-[150px]">
                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              a.status === 'critico' ? 'bg-red-500' : a.status === 'alerta' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min((a.count / 6) * 100, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          a.status === 'critico' ? 'bg-red-50 text-red-600' : 
                          a.status === 'alerta' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {a.status === 'critico' ? 'Sobrecarga' : a.status === 'alerta' ? 'No Limite' : 'Disponível'}
                        </span>
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
                            <AlertTriangle className="w-3 h-3" /> Aguardando designação
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
    </div>
  );
}