import { VotingCard } from '@/components/VotingCard';
import { Results } from '@/components/Results';
import { useVoting, VoteCategory } from '@/hooks/useVoting';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { hasVotedInCategory, submitVote, getResults, totalVotes, votedCategories } = useVoting();
  const { toast } = useToast();

  const handleVote = (category: VoteCategory, candidate: string) => {
    const success = submitVote(category, candidate);
    
    if (success) {
      toast({
        title: '✅ Voto registrado!',
        description: 'Obrigado por participar da votação da Turma do Vôlei!',
      });
    } else {
      toast({
        title: '❌ Erro',
        description: 'Você já votou anteriormente.',
        variant: 'destructive',
      });
    }
  };

  const results = getResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🏐 Turma do Vôlei
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Melhores do Ano - Votação Anônima
          </p>
          <p className="text-sm text-muted-foreground">
            {votedCategories.size === 3 
              ? '✅ Você votou em todas as categorias! Veja os resultados abaixo.' 
              : `📊 Vote uma vez em cada categoria (${votedCategories.size}/3 categorias votadas)`}
          </p>
        </div>

        {/* Voting Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <VotingCard
            category="melhor-saque"
            title="Melhor Saque"
            description="Quem tem o saque mais poderoso?"
            icon="🏐"
            onVote={handleVote}
            hasVotedInCategory={hasVotedInCategory('melhor-saque')}
          />
          <VotingCard
            category="mais-reclamao"
            title="Mais Reclamão"
            description="Quem reclama de tudo? 😅"
            icon="😤"
            onVote={handleVote}
            hasVotedInCategory={hasVotedInCategory('mais-reclamao')}
          />
          <VotingCard
            category="mais-gente-boa"
            title="Mais Gente Boa"
            description="Quem é o mais parceiro?"
            icon="😊"
            onVote={handleVote}
            hasVotedInCategory={hasVotedInCategory('mais-gente-boa')}
          />
        </div>

        {/* Results */}
        <Results results={results} totalVotes={totalVotes} />
      </div>
    </div>
  );
};

export default Index;
