export const sendVoteConfirmation = (
  voteCode: string,
  category: string,
  candidate: string
) => {
  const categoryNames: Record<string, string> = {
    'melhor-saque': 'Melhor Saque',
    'mais-reclamao': 'Mais Reclamação',
    'mais-gente-boa': 'Mais Gente Boa',
  };

  const message = `🏐 CONFIRMAÇÃO DE VOTO - Turma do Vôlei

Código: ${voteCode}
Categoria: ${categoryNames[category] || category}
Candidato: ${candidate}
Data: ${new Date().toLocaleString('pt-BR')}

⚠️ Clique em ENVIAR para confirmar este voto`;

  const phoneNumber = '5548996681855';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

export const generateVoteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'VOTE-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
