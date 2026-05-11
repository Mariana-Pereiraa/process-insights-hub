import type { ProcessStatus } from "@/data/mock-processes";

export const processStatusConfig: Partial<Record<
  ProcessStatus,
  { label: string; className: string; dotClass: string }
>> & Record<string, { label: string; className: string; dotClass: string }> = {
  em_revisao: {
    label: "Aguardando análise",
    className: "bg-status-review-bg text-status-review",
    dotClass: "bg-status-review",
  },
  em_analise: {
    label: "Análise",
    className: "bg-indigo-100 text-indigo-700",
    dotClass: "bg-indigo-600",
  },
  em_ajuste: {
    label: "Ajuste",
    className: "bg-orange-100 text-orange-700",
    dotClass: "bg-orange-600",
  },
  concluido: {
    label: "Concluído",
    className: "bg-status-done-bg text-status-done",
    dotClass: "bg-status-done",
  },
  em_ajuste_anual: {
    label: "Ajuste anual",
    className: "bg-orange-100 text-orange-700",
    dotClass: "bg-orange-600",
  },
  em_analise_anual: {
    label: "Análise anual",
    className: "bg-indigo-100 text-indigo-700",
    dotClass: "bg-indigo-600",
  },
  pendente_revisao_anual: {
    label: "Revisão",
    className: "bg-cyan-100 text-cyan-700",
    dotClass: "bg-cyan-600",
  },
};

export const processStatusOptions = Object.entries(processStatusConfig).map(
  ([value, config]) => ({
    value: value as ProcessStatus,
    label: config.label,
  })
);

// Lista de analistas disponíveis que podem ser atribuídos por SecGovResponsável
export interface Analista {
  username: string;
  nome: string;
  cargo: string;
}

export const analistasDisponiveis: Analista[] = [
  { username: "equipe.secgov", nome: "Equipe SECGOV", cargo: "Analista de Governança" },
  { username: "paula.ribeiro", nome: "Paula Ribeiro", cargo: "Analista Sênior" },
  { username: "thiago.martins", nome: "Thiago Martins", cargo: "Analista Pleno" },
  { username: "renata.souza", nome: "Renata Souza", cargo: "Analista de Riscos" },
  { username: "diego.ferreira", nome: "Diego Ferreira", cargo: "Analista Júnior" },
];

// Constante de prazo para ajustes solicitados pela unidade
export const DIAS_PRAZO_AJUSTE = 15;

/**
 * Calcula informação de prazo para processos em ajuste.
 * Retorna null se o processo não estiver em ajuste ou sem evento de solicitação.
 */
export function calcularPrazoAjuste(
  status: string,
  historico: { tipo: string; data: string; hora: string }[]
): {
  diasRestantes: number;
  vencido: boolean;
  proximo: boolean;
  dataLimite: string;
} | null {
  if (status !== "em_ajuste" && status !== "em_ajuste_anual") return null;

  // Pega o último evento de solicitação de ajuste
  const solicitacao = [...historico]
    .reverse()
    .find((h) => h.tipo === "ajuste_solicitado" || h.tipo === "ajuste_anual_solicitado");
  if (!solicitacao) return null;

  const [d, m, y] = solicitacao.data.split("/").map(Number);
  const inicio = new Date(y, m - 1, d);
  const limite = new Date(inicio);
  limite.setDate(limite.getDate() + DIAS_PRAZO_AJUSTE);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diffMs = limite.getTime() - hoje.getTime();
  const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    diasRestantes,
    vencido: diasRestantes < 0,
    proximo: diasRestantes >= 0 && diasRestantes <= 3,
    dataLimite: `${String(limite.getDate()).padStart(2, "0")}/${String(limite.getMonth() + 1).padStart(2, "0")}/${limite.getFullYear()}`,
  };
}
