export type HistoricoTipo =
  | "criado"
  | "chegou_revisao"
  | "em_analise"
  | "ajuste_solicitado"
  | "revisado"
  | "concluido"
  | "em_ajuste"
  | "em_ajuste_anual"
  | "em_analise_anual"
  | "pendente_revisao_anual"
  | "ajuste_anual_solicitado";

export type ProcessStatus = "em_revisao" | HistoricoTipo;

export interface HistoricoEvento {
  id: string;
  tipo: HistoricoTipo;
  data: string; // dd/mm/aaaa
  hora: string; // HH:MM
  usuario?: string;
  observacao?: string;
}

export interface Risk {
  id: string;
  nome: string;
  faseProcesso: string;
  tipoRisco: string;
  descricao: string;
  probabilidade: string;
  impacto: string;
  nivelRisco: string;
}

export interface ProcessStep {
  id: number;
  titulo: string;
  descricao: string;
  riscos?: Risk[];
  controles?: string[];
  respostas?: string[];
  atividades?: string[];
  ocorrencias?: string[];
  observacoes?: string;
}

export interface Process {
  id: string;
  nome: string;
  unidade: string;
  unidadeSigla: string;
  setor: string;
  responsavel: string;
  responsavelUsername: string;
  status: ProcessStatus;
  diasDesdeUltimaRevisao: number;
  dataEnvioRevisao: string;
  etapas: ProcessStep[];
  historico: HistoricoEvento[];
}

export const mockProcesses: Process[] = [
  {
    id: "1",
    nome: "Concessão de bolsas de estágio",
    unidade: "Gabinete do Reitor",
    unidadeSigla: "GR",
    setor: "Gabinete do Reitor",
    responsavel: "Mariana Pereira Da Silva",
    responsavelUsername: "mariana.silva",
    status: "em_analise",
    diasDesdeUltimaRevisao: 370,
    dataEnvioRevisao: "10/04/2025",
    etapas: [
      {
        id: 1,
        titulo: "Identificação de Riscos",
        descricao: "Identificação de riscos relacionados ao processo",
        riscos: [
          { id: "r1", nome: "Atraso na publicação do edital", faseProcesso: "Planejamento", tipoRisco: "AMEAÇA", descricao: "Risco de atraso na publicação do edital de seleção", probabilidade: "Média", impacto: "Alto", nivelRisco: "Alto" },
          { id: "r2", nome: "Falta de recursos financeiros", faseProcesso: "Execução", tipoRisco: "AMEAÇA", descricao: "Insuficiência de recursos para cobrir todas as bolsas", probabilidade: "Baixa", impacto: "Muito Alto", nivelRisco: "Alto" },
        ],
        observacoes: "Riscos identificados na última análise semestral",
      },
      {
        id: 2,
        titulo: "Avaliação de Riscos e Controles",
        descricao: "Avaliação dos riscos identificados e controles existentes",
        controles: ["Cronograma de publicação com marcos definidos", "Reserva orçamentária prévia", "Comitê de acompanhamento mensal"],
        observacoes: "Controles avaliados e considerados adequados",
      },
      {
        id: 3,
        titulo: "Resposta aos Riscos",
        descricao: "Definição de respostas para os riscos identificados",
        respostas: ["Mitigar: Antecipar preparação do edital em 30 dias", "Transferir: Solicitar suplementação orçamentária", "Aceitar: Monitorar indicadores trimestrais"],
        observacoes: "Respostas aprovadas pelo comitê de gestão",
      },
      {
        id: 4,
        titulo: "Atividades de Controle",
        descricao: "Atividades de controle implementadas",
        atividades: ["Reunião mensal de acompanhamento", "Relatório trimestral de execução", "Auditoria interna anual", "Sistema de alertas automáticos"],
        observacoes: "Todas as atividades em execução regular",
      },
      {
        id: 5,
        titulo: "Ocorrências de Risco",
        descricao: "Registro de ocorrências de risco",
        ocorrencias: ["15/01/2025 - Atraso de 5 dias na publicação do edital (resolvido)"],
        observacoes: "Ocorrência registrada e tratada",
      },
    ],
    historico: [
      { id: "h1-1", tipo: "criado", data: "01/03/2024", hora: "09:15", usuario: "Mariana Pereira Da Silva", observacao: "Processo cadastrado no sistema" },
      { id: "h1-2", tipo: "chegou_revisao", data: "15/03/2024", hora: "10:00", usuario: "Mariana Pereira Da Silva", observacao: "Primeira revisão enviada" },
      { id: "h1-3", tipo: "em_analise", data: "16/03/2024", hora: "09:00", usuario: "Equipe SECGOV" },
      { id: "h1-4", tipo: "ajuste_solicitado", data: "20/03/2024", hora: "15:10", usuario: "Equipe SECGOV", observacao: "Detalhar identificação de riscos" },
      { id: "h1-5", tipo: "chegou_revisao", data: "28/03/2024", hora: "11:20", usuario: "Mariana Pereira Da Silva", observacao: "Reenviado após ajustes" },
      { id: "h1-6", tipo: "revisado", data: "02/04/2024", hora: "14:00", usuario: "Equipe SECGOV", observacao: "Revisão aprovada" },
      { id: "h1-7", tipo: "concluido", data: "05/04/2024", hora: "17:30", usuario: "Equipe SECGOV", observacao: "Ciclo anterior concluído" },
      { id: "h1-8", tipo: "pendente_revisao_anual", data: "01/04/2025", hora: "08:00", usuario: "Sistema", observacao: "Ciclo anual disparado automaticamente" },
      { id: "h1-11", tipo: "em_analise_anual", data: "12/04/2025", hora: "10:05", usuario: "Equipe SECGOV", observacao: "Revisão anual iniciada pela SECGOV" },
      { id: "h1-12", tipo: "ajuste_anual_solicitado", data: "15/04/2025", hora: "11:20", usuario: "Equipe SECGOV", observacao: "Solicitados ajustes referentes ao ciclo anual" },
      { id: "h1-13", tipo: "em_ajuste_anual", data: "16/04/2025", hora: "09:00", usuario: "Mariana Pereira Da Silva", observacao: "Responsável realizando ajustes solicitados" },
    ],
  },
  {
    id: "2",
    nome: "Gestão de contratos de TI",
    unidade: "Superintendência de TI",
    unidadeSigla: "STI",
    setor: "Contratos",
    responsavel: "Carlos Eduardo Santos",
    responsavelUsername: "carlos.santos",
    status: "em_revisao",
    diasDesdeUltimaRevisao: 380,
    dataEnvioRevisao: "01/04/2025",
    etapas: [
      {
        id: 1, titulo: "Identificação de Riscos", descricao: "Identificação de riscos em contratos de TI",
        riscos: [
          { id: "r3", nome: "Descontinuidade de fornecedor", faseProcesso: "Execução", tipoRisco: "AMEAÇA", descricao: "Risco de descontinuidade do fornecedor principal", probabilidade: "Baixa", impacto: "Muito Alto", nivelRisco: "Crítico" },
        ],
        observacoes: "Análise atualizada em março/2025",
      },
      { id: 2, titulo: "Avaliação de Riscos e Controles", descricao: "Avaliação dos controles contratuais", controles: ["Cláusulas de SLA", "Garantias contratuais", "Plano de contingência"], observacoes: "Controles adequados" },
      { id: 3, titulo: "Resposta aos Riscos", descricao: "Respostas definidas", respostas: ["Mitigar: Manter fornecedor backup", "Transferir: Seguro contratual"], observacoes: "" },
      { id: 4, titulo: "Atividades de Controle", descricao: "Atividades de monitoramento", atividades: ["Monitoramento semanal de SLA", "Reunião mensal com fornecedor"], observacoes: "" },
      { id: 5, titulo: "Ocorrências de Risco", descricao: "Sem ocorrências registradas", ocorrencias: [], observacoes: "" },
    ],
    historico: [
      { id: "h2-1", tipo: "criado", data: "10/01/2024", hora: "11:00", usuario: "Carlos Eduardo Santos", observacao: "Processo cadastrado" },
      { id: "h2-2", tipo: "chegou_revisao", data: "20/01/2024", hora: "09:30", usuario: "Carlos Eduardo Santos" },
      { id: "h2-3", tipo: "revisado", data: "05/02/2024", hora: "10:15", usuario: "Equipe SECGOV" },
      { id: "h2-4", tipo: "concluido", data: "08/02/2024", hora: "16:00", usuario: "Equipe SECGOV", observacao: "Primeiro ciclo concluído" },
      { id: "h2-5", tipo: "chegou_revisao", data: "10/02/2025", hora: "08:00", usuario: "Carlos Eduardo Santos", observacao: "Nova revisão anual" },
      { id: "h2-6", tipo: "em_analise", data: "12/02/2025", hora: "09:00", usuario: "Equipe SECGOV" },
      { id: "h2-7", tipo: "ajuste_solicitado", data: "20/02/2025", hora: "16:40", usuario: "Equipe SECGOV", observacao: "Ajustar cláusulas de SLA" },
      { id: "h2-8", tipo: "chegou_revisao", data: "01/04/2025", hora: "08:20", usuario: "Carlos Eduardo Santos", observacao: "Reenviado após ajustes" },
    ],
  },
  {
    id: "3",
    nome: "Processo de licitação de obras",
    unidade: "Pró-Reitoria de Infraestrutura",
    unidadeSigla: "PROINFRA",
    setor: "Licitações",
    responsavel: "Ana Beatriz Lima",
    responsavelUsername: "ana.lima",
    status: "concluido",
    diasDesdeUltimaRevisao: 30,
    dataEnvioRevisao: "15/03/2025",
    etapas: [
      { id: 1, titulo: "Identificação de Riscos", descricao: "Riscos em licitações de obras", riscos: [{ id: "r4", nome: "Sobrepreço em propostas", faseProcesso: "Seleção", tipoRisco: "AMEAÇA", descricao: "Propostas acima do valor de referência", probabilidade: "Média", impacto: "Alto", nivelRisco: "Alto" }], observacoes: "Revisado" },
      { id: 2, titulo: "Avaliação de Riscos e Controles", descricao: "Controles de licitação", controles: ["Pesquisa de preços obrigatória", "Comissão de licitação"], observacoes: "" },
      { id: 3, titulo: "Resposta aos Riscos", descricao: "Respostas", respostas: ["Mitigar: Pesquisa ampla de mercado"], observacoes: "" },
      { id: 4, titulo: "Atividades de Controle", descricao: "Atividades", atividades: ["Checklist de conformidade", "Parecer jurídico obrigatório"], observacoes: "" },
      { id: 5, titulo: "Ocorrências de Risco", descricao: "Sem ocorrências", ocorrencias: [], observacoes: "" },
    ],
    historico: [
      { id: "h3-1", tipo: "criado", data: "05/12/2023", hora: "10:30", usuario: "Ana Beatriz Lima" },
      { id: "h3-2", tipo: "chegou_revisao", data: "20/02/2025", hora: "09:10", usuario: "Ana Beatriz Lima" },
      { id: "h3-3", tipo: "revisado", data: "10/03/2025", hora: "15:25", usuario: "Equipe SECGOV", observacao: "Revisão concluída sem ressalvas" },
      { id: "h3-4", tipo: "concluido", data: "15/03/2025", hora: "17:00", usuario: "Equipe SECGOV", observacao: "Processo aprovado" },
    ],
  },
  {
    id: "4",
    nome: "Gestão de patrimônio",
    unidade: "Pró-Reitoria de Administração",
    unidadeSigla: "PROAD",
    setor: "Patrimônio",
    responsavel: "Roberto Almeida",
    responsavelUsername: "roberto.almeida",
    status: "em_revisao",
    diasDesdeUltimaRevisao: 200,
    dataEnvioRevisao: "25/09/2024",
    etapas: [
      { id: 1, titulo: "Identificação de Riscos", descricao: "Riscos patrimoniais", riscos: [{ id: "r5", nome: "Extravio de bens", faseProcesso: "Controle", tipoRisco: "AMEAÇA", descricao: "Risco de extravio ou furto de bens patrimoniais", probabilidade: "Média", impacto: "Médio", nivelRisco: "Médio" }], observacoes: "" },
      { id: 2, titulo: "Avaliação de Riscos e Controles", descricao: "Avaliação", controles: ["Inventário anual", "Sistema de rastreamento"], observacoes: "" },
      { id: 3, titulo: "Resposta aos Riscos", descricao: "Respostas", respostas: ["Mitigar: Etiquetamento RFID"], observacoes: "" },
      { id: 4, titulo: "Atividades de Controle", descricao: "Atividades", atividades: ["Conferência trimestral"], observacoes: "" },
      { id: 5, titulo: "Ocorrências de Risco", descricao: "Sem ocorrências", ocorrencias: [], observacoes: "" },
    ],
    historico: [
      { id: "h4-1", tipo: "criado", data: "15/06/2024", hora: "13:45", usuario: "Roberto Almeida" },
      { id: "h4-2", tipo: "chegou_revisao", data: "25/09/2024", hora: "10:00", usuario: "Roberto Almeida" },
      { id: "h4-3", tipo: "em_analise", data: "28/09/2024", hora: "09:15", usuario: "Equipe SECGOV" },
      { id: "h4-4", tipo: "ajuste_solicitado", data: "05/10/2024", hora: "14:20", usuario: "Equipe SECGOV", observacao: "Detalhar controles de inventário" },
      { id: "h4-5", tipo: "chegou_revisao", data: "18/10/2024", hora: "11:00", usuario: "Roberto Almeida", observacao: "Voltou do ajuste — reenviado para revisão" },
    ],
  },
  {
    id: "5",
    nome: "Controle de frequência de servidores",
    unidade: "Pró-Reitoria de Gestão de Pessoas",
    unidadeSigla: "PROGEP",
    setor: "RH",
    responsavel: "Fernanda Costa",
    responsavelUsername: "fernanda.costa",
    status: "concluido",
    diasDesdeUltimaRevisao: 60,
    dataEnvioRevisao: "13/02/2025",
    etapas: [
      { id: 1, titulo: "Identificação de Riscos", descricao: "Riscos de frequência", riscos: [{ id: "r6", nome: "Fraude no ponto", faseProcesso: "Operação", tipoRisco: "AMEAÇA", descricao: "Registro indevido de frequência", probabilidade: "Baixa", impacto: "Alto", nivelRisco: "Médio" }], observacoes: "" },
      { id: 2, titulo: "Avaliação de Riscos e Controles", descricao: "Avaliação", controles: ["Ponto biométrico", "Auditoria mensal"], observacoes: "" },
      { id: 3, titulo: "Resposta aos Riscos", descricao: "Respostas", respostas: ["Mitigar: Sistema biométrico com geolocalização"], observacoes: "" },
      { id: 4, titulo: "Atividades de Controle", descricao: "Atividades", atividades: ["Relatório mensal de inconsistências"], observacoes: "" },
      { id: 5, titulo: "Ocorrências de Risco", descricao: "Sem ocorrências", ocorrencias: [], observacoes: "" },
    ],
    historico: [
      { id: "h5-1", tipo: "criado", data: "20/08/2024", hora: "08:50", usuario: "Fernanda Costa" },
      { id: "h5-2", tipo: "chegou_revisao", data: "20/01/2025", hora: "09:30", usuario: "Fernanda Costa" },
      { id: "h5-3", tipo: "revisado", data: "10/02/2025", hora: "11:15", usuario: "Equipe SECGOV" },
      { id: "h5-4", tipo: "concluido", data: "13/02/2025", hora: "16:40", usuario: "Equipe SECGOV", observacao: "Aprovado e arquivado" },
    ],
  },
];
