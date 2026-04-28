export type NotificationType =
  | "chegou_revisao"
  | "ajuste_solicitado"
  | "revisado"
  | "concluido"
  | "nova_revisao_anual"
  | "prazo_proximo";

export interface Notification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  descricao: string;
  processId: string;
  processoNome: string;
  data: string; // dd/mm/aaaa
  hora: string; // HH:MM
  lida: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    tipo: "ajuste_solicitado",
    titulo: "Ajustes solicitados no processo",
    descricao:
      "A SECGOV solicitou ajustes no processo Gestão de Convênios Institucionais.",
    processId: "6",
    processoNome: "Gestão de Convênios Institucionais",
    data: "22/04/2026",
    hora: "09:42",
    lida: false,
  },

  {
    id: "n2",
    tipo: "concluido",
    titulo: "Processo concluído",
    descricao:
      "O processo Controle de Frequência de Servidores foi aprovado e finalizado.",
    processId: "5",
    processoNome: "Controle de Frequência de Servidores",
    data: "21/04/2026",
    hora: "14:05",
    lida: false,
  },

  {
    id: "n3",
    tipo: "nova_revisao_anual",
    titulo: "Revisão anual pendente",
    descricao:
      "O processo Concessão de Bolsas de Estágio entrou em novo ciclo anual de revisão.",
    processId: "1",
    processoNome: "Concessão de Bolsas de Estágio",
    data: "20/04/2026",
    hora: "10:30",
    lida: true,
  },

  {
    id: "n4",
    tipo: "prazo_proximo",
    titulo: "Prazo de revisão próximo",
    descricao:
      "O processo Gestão de Patrimônio precisa ser revisado em até 7 dias.",
    processId: "4",
    processoNome: "Gestão de Patrimônio",
    data: "18/04/2026",
    hora: "11:50",
    lida: true,
  },
];

