
// src/routes/prazo-revisao.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/prazo-revisao")({
  component: PrazoRevisao,
  head: () => ({
    meta: [{ title: "Prazo de Revisão" }],
  }),
});


function PrazoRevisao() {
    const [prazoGeralRevisao, setPrazoGeralRevisao] = useState<
      { ano: string; prazo: string }[]
    >([]);
  
    const [novoPrazo, setNovoPrazo] = useState("");
    const ano = novoPrazo.split("-")[0];
    const [editandoAno, setEditandoAno] = useState<string | null>(null);
  
    const prazosOrdenados = [...prazoGeralRevisao].sort(
      (a, b) => Number(b.ano) - Number(a.ano)
    );
  
    return (
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
  
        <div className="flex-1 flex flex-col">
          <Topbar title="Prazo de Revisão" />
  
          <main className="flex-1 p-6 overflow-auto">  
            {/* Voltar */}
            <Link
              to="/"
              className="flex items-center gap-2 text-sm mb-6 text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
  
            <div className="bg-card rounded-2xl border p-6 shadow-sm">
  
              <h2 className="text-lg font-bold mb-4">
                Definir prazo de revisão
              </h2>
  
              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
  
                
  
                <input
                  type="date"
                  value={novoPrazo}
                  onChange={(e) => setNovoPrazo(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
  
  <Button
    onClick={() => {
      if (!novoPrazo) return;

      const ano = novoPrazo.split("-")[0];

      setPrazoGeralRevisao((prev) => [
        ...prev.filter((p) => p.ano !== ano), // mantém 1 por ano
        { ano, prazo: novoPrazo },
      ]);

      setNovoPrazo("");
      setEditandoAno(null);
    }}
    className="bg-blue-600 text-white"
  >
    {editandoAno ? "Atualizar" : "Salvar"}
  </Button>
              </div>
  
              {/* Tabela */}
              <div className="overflow-x-auto">
                <table className="w-full border rounded-xl overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground">
                        Ano
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase text-muted-foreground">
                        Prazo
                      </th>
                      <th className="text-right px-4 py-3 text-xs uppercase text-muted-foreground">
                        Ações
                      </th>
                    </tr>
                  </thead>
  
                  <tbody>
                    {prazosOrdenados.map((item) => (
                      <tr key={item.ano} className="border-t">
                        <td className="px-4 py-3 font-medium">
                          {item.ano}
                        </td>
  
                        <td className="px-4 py-3">
                          {item.prazo.split("-").reverse().join("/")}
                        </td>
  
                        <td className="px-4 py-3 text-right">
                          {/* Editar */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNovoPrazo(item.prazo);
              setEditandoAno(item.ano);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
                           {/* Remover */}
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() =>
              setPrazoGeralRevisao((prev) =>
                prev.filter((p) => p.ano !== item.ano)
              )
            }
          >
            <Trash2 className="w-4 h-4" />
          </Button>
                        </td>
                      </tr>
                    ))}
  
                    {prazosOrdenados.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Nenhum prazo cadastrado
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