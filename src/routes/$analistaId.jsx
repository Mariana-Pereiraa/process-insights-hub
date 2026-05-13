import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, User, FileText, LayoutGrid, CheckCircle2, Clock } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { AppSidebar } from "@/components/AppSidebar";
import { mockProcesses } from "@/data/mock-processes";
import { StatusBadge } from "@/components/StatusBadge";
import { analistasDisponiveis } from "@/lib/process-status";
import { Button } from "@/components/ui/button"; // Certifique-se de importar o Button
import { useMemo } from "react";

export const Route = createFileRoute("/$analistaId")({
  component: DetalhesAnalista,
});

// ... outros imports

function DetalhesAnalista() {
  const { analistaId } = Route.useParams();
  
  const analista = useMemo(() => 
    analistasDisponiveis.find(a => a.username === analistaId), 
    [analistaId]
  );

  const processosDoAnalista = useMemo(() => 
    mockProcesses.filter(p => p.analistaUsername === analistaId), 
    [analistaId]
  );

  const stats = useMemo(() => ({
    concluidos: processosDoAnalista.filter(p => p.status === "concluido").length,
    pendentes: processosDoAnalista.filter(p => p.status !== "concluido").length
  }), [processosDoAnalista]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={`Processos Alocados — ${analista?.nome || analistaId}`} />
        
        <main className="flex-1 p-6 overflow-auto space-y-6">
          <Link 
            to="/gerenciamento-analistas" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Gestão de Equipe
          </Link>

          {/* Cabeçalho de Perfil */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-2xl font-bold text-violet-600 border-2 border-violet-200">
                {analista?.nome.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{analista?.nome}</h2>
                <p className="text-sm text-muted-foreground">{analista?.cargo}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-center px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Concluídos</p>
                <p className="text-xl font-bold text-emerald-700">{stats.concluidos}</p>
              </div>
              <div className="text-center px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Em Aberto</p>
                <p className="text-xl font-bold text-amber-700">{stats.pendentes}</p>
              </div>
            </div>
          </div>

          {/* Listagem de Processos */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/10">
              <h3 className="font-bold flex items-center gap-2 text-foreground">
                <LayoutGrid className="w-4 h-4 text-violet-500" />
                Carteira de Trabalho
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 border-b border-border">
                  <tr className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                    <th className="px-5 py-3 text-left">Nome do Processo</th>
                    <th className="px-5 py-3 text-left">Início da Revisão</th>
                    <th className="px-5 py-3 text-left">Fim da Revisão</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {processosDoAnalista.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-foreground">{p.nome}</div>
                        <div className="text-[10px] text-muted-foreground">ID: {p.id}</div>
                      </td>
                      
                      {/* NOVA COLUNA: INÍCIO */}
                      <td className="px-5 py-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {p.dataEnvioRevisao}
                        </div>
                      </td>
                      {/* NOVA COLUNA: FIM */}
                      <td className="px-5 py-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                          {/* @ts-ignore - p.dataConclusao precisa existir no seu mock-processes */}
                          {p.dataConclusao || "—"}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link to="/revisao/$processId" params={{ processId: p.id }}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <FileText className="w-3.5 h-3.5" />
                            Acessar
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {processosDoAnalista.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground italic">
                        Este analista não possui processos alocados no momento.
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