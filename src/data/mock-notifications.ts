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
    tipo: "chegou_revisao",
    titulo: "Novo processo para revisão",
    descricao: "O processo chegou para sua análise e revisão.",
    processId: "1",
    processoNome: "Gestão de Contratos Administrativos",
    data: "22/04/2026",
    hora: "09:42",
    lida: false,
  },
  {
    id: "n2",
    tipo: "ajuste_solicitado",
    titulo: "Ajuste solicitado",
    descricao: "Foram solicitados ajustes em um processo sob sua responsabilidade.",
    processId: "2",
    processoNome: "Aquisição de Bens e Serviços",
    data: "22/04/2026",
    hora: "08:15",
    lida: false,
  },
  {
    id: "n3",
    tipo: "revisado",
    titulo: "Processo revisado",
    descricao: "Um processo foi revisado e aguarda sua validação final.",
    processId: "3",
    processoNome: "Gestão de Pessoas e Folha de Pagamento",
    data: "21/04/2026",
    hora: "16:28",
    lida: false,
  },
  {
    id: "n4",
    tipo: "concluido",
    titulo: "Processo concluído",
    descricao: "O processo foi finalizado com sucesso.",
    processId: "4",
    processoNome: "Controle Patrimonial",
    data: "20/04/2026",
    hora: "14:05",
    lida: true,
  },
  {
    id: "n5",
    tipo: "nova_revisao_anual",
    titulo: "Nova revisão anual disponível",
    descricao: "O ciclo anual foi reaberto para revisão do processo.",
    processId: "5",
    processoNome: "Gestão Orçamentária e Financeira",
    data: "19/04/2026",
    hora: "10:30",
    lida: true,
  },
  {
    id: "n6",
    tipo: "prazo_proximo",
    titulo: "Prazo se aproximando",
    descricao: "A revisão anual deste processo vence em 7 dias.",
    processId: "6",
    processoNome: "Tecnologia da Informação",
    data: "18/04/2026",
    hora: "11:50",
    lida: true,
  },
];
