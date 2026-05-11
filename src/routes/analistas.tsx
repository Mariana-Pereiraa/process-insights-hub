import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft, UserCog, FileText, AlertTriangle } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProcesses } from "@/data/mock-processes";
import { analistasDisponiveis } from "@/lib/process-status";

export const Route = createFileRoute("/analistas")({
  component: AnalistasPage,
  head: () => ({
    meta: [
      { title: "Responsáveis por Análise — Gestão de Riscos" },
      { name: "description", content: "Distribuição de processos por responsável de análise designado pela SECGOV." },
    ],
  }),
});

function AnalistasPage() {
  // Agrupa processos por analista designado
  const grupos = useMemo(() => {
    const map = new Map<string, { nome: string; username: string; cargo?: string; processos: typeof mockProcesses }>();

    // Inicia com analistas conhecidos (mesmo sem processos)
    for (const a of analistasDisponiveis) {
      map.set(a.username, { nome: a.nome, username: a.username, cargo: a.cargo, processos: [] });
    }

    for (const p of mockProcesses) {
      if (p.analistaUsername && p.analistaNome) {
        const existing = map.get(p.analistaUsername);
        if (existing) {
          existing.processos.push(p);
        } else {
          map.set(p.analistaUsername, {
            nome: p.analistaNome,
            username: p.analistaUsername,
            processos: [p],
          });
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.processos.length - a.processos.length);
  }, []);

  const semDesignacao = useMemo(
    () => mockProcesses.filter((p) => !p.analistaUsername),
    []
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Responsáveis por Análise" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>

            <header className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Responsáveis por análise</h1>
                <p className="text-sm text-muted-foreground">
                  Distribuição de processos por analista designado pela SECGOV.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCog className="w-4 h-4" />
                {grupos.length} analistas · {mockProcesses.length} processos
              </div>
            </header>

            {semDesignacao.length > 0 && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-900">
                    {semDesignacao.length} processo(s) sem responsável de análise
                  </p>
                  <p className="text-amber-800/80">
                    O perfil <strong>Responsável SECGOV</strong> deve designar um analista para esses processos.
                  </p>
                </div>
              </div>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grupos.map((g) => (
                <div key={g.username} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-violet-700">
                          {g.nome.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{g.nome}</p>
                        <p className="text-xs text-muted-foreground">{g.cargo ?? g.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground leading-none">{g.processos.length}</p>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">processos</p>
                    </div>
                  </div>

                  {g.processos.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-2">Sem processos designados.</p>
                  ) : (
                    <ul className="space-y-2">
                      {g.processos.map((p) => (
                        <li key={p.id}>
                          <Link
                            to="/revisao/$processId"
                            params={{ processId: p.id }}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                              <span className="text-sm text-foreground truncate">{p.nome}</span>
                            </div>
                            <StatusBadge status={p.status} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            {semDesignacao.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-base font-semibold text-foreground mb-3">
                  Processos sem analista designado
                </h2>
                <ul className="divide-y divide-border">
                  {semDesignacao.map((p) => (
                    <li key={p.id} className="py-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.nome}</p>
                        <p className="text-xs text-muted-foreground">{p.unidade}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={p.status} />
                        <Link to="/revisao/$processId" params={{ processId: p.id }}>
                          <Button size="sm" variant="outline" className="gap-1.5">
                            <UserCog className="w-4 h-4" /> Designar
                          </Button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
