import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, History } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { HistoricoTimeline } from "@/components/HistoricoTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockProcesses } from "@/data/mock-processes";

export const Route = createFileRoute("/historico/$processId")({
  component: HistoricoPage,
  head: () => ({
    meta: [
      { title: "Histórico do Processo — Gestão de Riscos" },
      { name: "description", content: "Linha do tempo completa de movimentações do processo" },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-8">
      <p className="mb-4">Processo não encontrado.</p>
      <Link to="/"><Button variant="outline">Voltar</Button></Link>
    </div>
  ),
});

function HistoricoPage() {
  const { processId } = useParams({ from: "/historico/$processId" });
  const process = mockProcesses.find((p) => p.id === processId);

  if (!process) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar title="Histórico do Processo" />
          <main className="flex-1 p-6">
            <p className="text-muted-foreground">Processo não encontrado.</p>
            <Link to="/" className="inline-block mt-4">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
            </Link>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Histórico do Processo" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Voltar para acompanhamento
              </Button>
            </Link>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <History className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-foreground">{process.nome}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {process.unidade} · {process.responsavel}
                  </p>
                  <div className="mt-3">
                    <StatusBadge status={process.status} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-5">Histórico do processo</h2>
              <HistoricoTimeline eventos={process.historico} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
