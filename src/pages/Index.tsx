import { VotingCard } from '@/components/VotingCard';
import { Results } from '@/components/Results';
import { AdminControl } from '@/components/AdminControl';
import { useVoting, VoteCategory } from '@/hooks/useVoting';
import { useToast } from '@/hooks/use-toast';
import turmaVoleiLogo from '@/assets/turma-volei-logo.jpeg';

const Index = () => {
  const { hasVotedInCategory, submitVote, getResults, totalVotes, votedCategories, resultsReleased, toggleResultsRelease } = useVoting();
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 court-pattern relative overflow-hidden">
      {/* Decorative floating volleyballs */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>🏐</div>
      <div className="absolute top-40 right-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🏐</div>
      <div className="absolute bottom-32 left-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🏐</div>
      <div className="absolute bottom-20 right-1/3 text-5xl opacity-10 animate-float" style={{ animationDelay: '3s' }}>🏐</div>
      
      {/* Net decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6 animate-fade-in-up">
            <img 
              src={turmaVoleiLogo} 
              alt="Turma do Vôlei Logo" 
              className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-primary shadow-2xl shadow-primary/50 hover:scale-110 transition-transform duration-300 animate-bounce-soft"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient animate-fade-in-up" style={{ animationDelay: '0.2s', textShadow: '0 0 30px rgba(93, 217, 245, 0.3)' }}>
            🏆 Turma do Vôlei 🏆
          </h1>
          <p className="text-xl text-muted-foreground mb-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            🏐 Melhores do Ano - Votação Anônima 🏐
          </p>
          <p className="text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {votedCategories.size === 3 
              ? '✅ Você votou em todas as categorias! Veja os resultados abaixo.' 
              : `📊 Vote uma vez em cada categoria (${votedCategories.size}/3 categorias votadas)`}
          </p>
        </div>

        {/* Voting Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <VotingCard
              category="melhor-saque"
              title="Melhor Saque"
              description="Quem tem o saque mais poderoso?"
              icon="🏐"
              onVote={handleVote}
              hasVotedInCategory={hasVotedInCategory('melhor-saque')}
            />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <VotingCard
              category="mais-reclamao"
              title="Mais Reclamão"
              description="Quem reclama de tudo? 😅"
              icon="😤"
              onVote={handleVote}
              hasVotedInCategory={hasVotedInCategory('mais-reclamao')}
            />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <VotingCard
              category="mais-gente-boa"
              title="Mais Gente Boa"
              description="Quem é o mais parceiro?"
              icon="😊"
              onVote={handleVote}
              hasVotedInCategory={hasVotedInCategory('mais-gente-boa')}
            />
          </div>
        </div>

        {/* Results */}
        <Results results={results} totalVotes={totalVotes} isReleased={resultsReleased} />

        {/* Admin Control */}
        <AdminControl resultsReleased={resultsReleased} onToggleResults={toggleResultsRelease} />
      </div>
    </div>
  );
};

export default Index;
