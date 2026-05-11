import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, FileText, Shield, Activity, AlertCircle, History, MoreVertical, ClipboardList } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { HistoricoTimeline } from "@/components/HistoricoTimeline";
import { mockProcesses, type ProcessStep, type Risk } from "@/data/mock-processes";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/ProfileContext";

export const Route = createFileRoute("/revisao/$processId")({
  component: ProcessReview,
  loader: ({ params }) => {
    const process = mockProcesses.find((p) => p.id === params.processId);
    if (!process) throw notFound();
    return process;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Revisão — ${loaderData?.nome ?? "Processo"}` },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Processo não encontrado</h1>
        <Link to="/" className="text-primary mt-4 inline-block">Voltar ao Acompanhamento</Link>
      </div>
    </div>
  ),
});

const stepIcons = [FileText, Shield, AlertTriangle, Activity, AlertCircle];

function ProcessReview() {
  const { profile } = useProfile();
  const [showReenviarModal, setShowReenviarModal] = useState(false);

  const process = Route.useLoaderData() as import("@/data/mock-processes").Process;
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([1]));
  const [observacaoRevisor, setObservacaoRevisor] = useState("");
  const [submitted, setSubmitted] = useState<"aceito" | "ajustes" | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
const [statusAtual, setStatusAtual] = useState(process.status);
const [revisaoIniciada, setRevisaoIniciada] = useState(
  process.status === "em_analise"
);
const [showCancelarEnvioModal, setShowCancelarEnvioModal] = useState(false);
const [showCancelarRevisaoModal, setShowCancelarRevisaoModal] = useState(false);

  const toggleStep = (id: number) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Revisão de Processo" />
        <main className="flex-1 p-6 overflow-auto">
          {/* Back link */}
          
          {/* Barra de ações superior */}
<div className="flex flex-wrap items-center justify-between mb-6">

{/* Voltar */}
<Link
  to="/"
  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
>
  <ArrowLeft className="w-4 h-4" />
  Voltar para Acompanhamento
</Link>

{/* Botões da direita */}
<div className="flex flex-wrap items-center gap-2">

  {/* BOTÕES APENAS PARA SECGOV */}
  {(profile.role === "secgov" || profile.role === "secgov_responsavel") && (
    <>
      {!revisaoIniciada ? (
        <Button
          onClick={() => {
            setStatusAtual("em_analise");
            setRevisaoIniciada(true);
          }}
          className="gap-2"
          variant="outline"
        >
          <ClipboardList className="w-4 h-4" />
          Iniciar Revisão
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          {/* Cancelar Revisão */}
          <Button
            variant="outline"
            onClick={() => setShowCancelarRevisaoModal(true)}
            className="gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Cancelar Revisão
          </Button>
      
          {/* Finalizar Revisão */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              Finalizar Revisão
            </Button>
      
            {showActionsMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-50 p-2">
                <button
                  onClick={() => {
                    setSubmitted("aceito");
                    setStatusAtual("concluido");
                    setShowActionsMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-left text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-status-done" />
                  Processo concluído
                </button>
      
                <button
                  onClick={() => {
                    setSubmitted("ajustes");
                    setStatusAtual("em_ajuste");
                    setShowActionsMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-left text-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-status-review" />
                  Solicitar ajuste
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )}
  
  {/* Ver Histórico - apenas unidade */}
  {profile.role === "unidade" && (
    <Link
      to="/historico/$processId"
      params={{ processId: process.id }}
    >
      <Button variant="outline" className="gap-2">
        <History className="w-4 h-4" />
        Ver Histórico
      </Button>
    </Link>
  )}

  {/* Enviar/Reenviar para revisão */}
  {profile.role === "unidade" && (
  <>
    {(statusAtual === "Rascunho" || statusAtual === "em_ajuste") && (
      <Button
        onClick={() => setShowReenviarModal(true)}
        variant="outline"
        className="gap-2"
      >
        <ClipboardList className="w-4 h-4" />
        {statusAtual === "Rascunho"
          ? "Enviar para revisão"
          : "Reenviar para revisão"}
      </Button>
    )}

{statusAtual === "em_revisao" && (
  <Button
    onClick={() => setShowCancelarEnvioModal(true)}
    variant="outline"
    className="gap-2"
  >
    <AlertTriangle className="w-4 h-4" />
    Cancelar envio
  </Button>
)}
  </>
)}
  
</div>
</div>
          {/* Process header */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Processo</p>
                <h2 className="text-xl font-bold text-foreground">{process.nome}</h2>
                <div className="flex flex-wrap gap-x-8 gap-y-2 mt-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Unidade: </span>
                    <span className="font-medium text-foreground">{process.unidade}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Setor: </span>
                    <span className="font-medium text-foreground">{process.setor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Responsável (criou): </span>
                    <span className="font-medium text-foreground">{process.responsavel}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Resp. pela análise: </span>
                    <span className="font-medium text-foreground">
                      {analistaAtual ? analistaAtual.nome : <em className="text-muted-foreground italic">Não designado</em>}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <StatusBadge status={statusAtual} />

                {profile.role === "secgov_responsavel" && (
                  <Button
                    onClick={() => setShowDesignarAnalista(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <UserCog className="w-4 h-4" />
                    {analistaAtual ? "Alterar analista" : "Designar analista"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Steps navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {process.etapas.map((etapa, idx) => {
              const Icon = stepIcons[idx] || FileText;
              const isOpen = openSteps.has(etapa.id);
              return (
                <button
                  key={etapa.id}
                  onClick={() => toggleStep(etapa.id)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    isOpen
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {etapa.id}
                    </span>
                  </div>
                  <p className={`text-xs font-medium leading-tight ${isOpen ? "text-primary" : "text-foreground"}`}>{etapa.titulo}</p>
                </button>
              );
            })}
          </div>

          {/* Step details */}
          <div className="space-y-4 mb-8">
            {process.etapas.map((etapa, idx) => {
              const Icon = stepIcons[idx] || FileText;
              const isOpen = openSteps.has(etapa.id);
              return (
                <div key={etapa.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleStep(etapa.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-foreground">{etapa.titulo}</h3>
                        <p className="text-xs text-muted-foreground">{etapa.descricao}</p>
                      </div>
                    </div>
                    {isOpen ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 space-y-4">
                      <div className="border-t border-border pt-4" />

                      {etapa.riscos && etapa.riscos.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Riscos Identificados</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Nome</th>
                                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Fase</th>
                                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Tipo</th>
                                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Probabilidade</th>
                                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Impacto</th>
                                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Nível</th>
                                </tr>
                              </thead>
                              <tbody>
                                {etapa.riscos.map((r) => (
                                  <tr key={r.id} className="border-b border-border/50">
                                    <td className="py-2.5 px-3 font-medium">{r.nome}</td>
                                    <td className="py-2.5 px-3 text-muted-foreground">{r.faseProcesso}</td>
                                    <td className="py-2.5 px-3">
                                      <span className="px-2 py-0.5 rounded-md bg-status-review-bg text-status-review text-xs font-semibold">{r.tipoRisco}</span>
                                    </td>
                                    <td className="py-2.5 px-3 text-muted-foreground">{r.probabilidade}</td>
                                    <td className="py-2.5 px-3 text-muted-foreground">{r.impacto}</td>
                                    <td className="py-2.5 px-3">
                                      <span className={`text-xs font-semibold ${r.nivelRisco === "Crítico" ? "text-status-review" : r.nivelRisco === "Alto" ? "text-status-review" : "text-muted-foreground"}`}>
                                        {r.nivelRisco}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {etapa.controles && etapa.controles.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Controles</h4>
                          <ul className="space-y-1.5">
                            {etapa.controles.map((c, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-status-done shrink-0 mt-0.5" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {etapa.respostas && etapa.respostas.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Respostas aos Riscos</h4>
                          <ul className="space-y-1.5">
                            {etapa.respostas.map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {etapa.atividades && etapa.atividades.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Atividades</h4>
                          <ul className="space-y-1.5">
                            {etapa.atividades.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {etapa.ocorrencias && etapa.ocorrencias.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Ocorrências</h4>
                          <ul className="space-y-1.5">
                            {etapa.ocorrencias.map((o, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <AlertCircle className="w-4 h-4 text-status-review shrink-0 mt-0.5" />
                                {o}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {etapa.observacoes && (
                        <div className="bg-muted/50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Observações</h4>
                          <p className="text-sm text-foreground">{etapa.observacoes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Histórico do Processo */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <History className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Histórico do Processo</h3>
                <p className="text-xs text-muted-foreground">Linha do tempo das movimentações e decisões</p>
              </div>
            </div>
            <HistoricoTimeline eventos={process.historico} />
          </div>

          {/* Review actions */}
          {submitted ? (
            <div className={`rounded-2xl border p-6 text-center ${
              submitted === "aceito"
                ? "bg-status-done-bg/50 border-status-done/20"
                : "bg-status-review-bg/50 border-status-review/20"
            }`}>
              <div className="flex justify-center mb-3">
                {submitted === "aceito"
                  ? <CheckCircle2 className="w-12 h-12 text-status-done" />
                  : <AlertTriangle className="w-12 h-12 text-status-review" />
                }
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {submitted === "aceito" ? "Processo Aceito" : "Ajustes Solicitados"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {submitted === "aceito"
                  ? "O processo foi aprovado na revisão."
                  : "A solicitação de ajustes foi enviada ao responsável."
                }
              </p>
              <Link to="/" className="inline-block mt-4">
                <Button variant="outline">Voltar ao Acompanhamento</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Ações da Revisão</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Observações do Revisor</label>
                <textarea
                  value={observacaoRevisor}
                  onChange={(e) => setObservacaoRevisor(e.target.value)}
                  placeholder="Adicione observações sobre esta revisão..."
                  rows={4}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setSubmitted("aceito")}
                  className="gap-2 bg-status-done hover:bg-status-done/90 text-primary-foreground"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Aceitar Processo
                </Button>
                <Button
                  onClick={() => setSubmitted("ajustes")}
                  variant="outline"
                  className="gap-2 border-status-review text-status-review hover:bg-status-review-bg"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Solicitar Ajustes
                </Button>
              </div>
            </div>
          )}
          {showReenviarModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-2">
  {statusAtual === "Rascunho"
    ? "Enviar para revisão"
    : "Reenviar para revisão"}
</h2>

<p className="text-sm text-muted-foreground mb-6">
  {statusAtual === "Rascunho"
    ? "Deseja enviar este processo para análise da SECGOV? O status será alterado para Em Revisão."
    : "Deseja reenviar este processo para nova análise da SECGOV? O status será alterado automaticamente para revisão."}
</p>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setShowReenviarModal(false)}
        >
          Cancelar
        </Button>

        <Button
          onClick={() => {
            setStatusAtual("em_revisao");
            setShowReenviarModal(false);
          }}
          className="bg-primary text-white"
        >
          Confirmar Envio
        </Button>
      </div>
    </div>
  </div>
)}

{showCancelarEnvioModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <h2 className="text-lg font-bold mb-2">
        Cancelar envio para revisão
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        Deseja realmente cancelar o envio deste processo? 
        O status será alterado para Rascunho.
      </p>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setShowCancelarEnvioModal(false)}
        >
          Voltar
        </Button>

        <Button
          onClick={() => {
            setStatusAtual("Rascunho");
            setShowCancelarEnvioModal(false);
          }}
          className="bg-primary text-white"
        >
          Confirmar Cancelamento
        </Button>
      </div>
    </div>
  </div>
)}
{showCancelarRevisaoModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <h2 className="text-lg font-bold mb-2">
        Cancelar revisão
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        Deseja realmente cancelar esta revisão? 
        O processo retornará para o status de Em Revisão.
      </p>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setShowCancelarRevisaoModal(false)}
        >
          Voltar
        </Button>

        <Button
          onClick={() => {
            setStatusAtual("em_revisao");
            setRevisaoIniciada(false);
            setShowCancelarRevisaoModal(false);
          }}
          className="bg-primary text-white"
        >
          Confirmar Cancelamento
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
