import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Share2 } from 'lucide-react';

interface ResultsProps {
  results: {
    [category: string]: {
      [candidate: string]: number;
    };
  };
  totalVotes: number;
  totalConfirmedVotes: number;
  totalPendingVotes: number;
  isReleased: boolean;
  isAdmin?: boolean;
}

const categoryNames: { [key: string]: string } = {
  'melhor-saque': '🏐 Melhor Saque',
  'mais-reclamao': '😤 Mais Reclamão',
  'mais-gente-boa': '😊 Mais Gente Boa',
};

export const Results = ({ results, totalVotes, totalConfirmedVotes, totalPendingVotes, isReleased, isAdmin }: ResultsProps) => {
  const handleShareWhatsApp = () => {
    let message = `🏐 *Turma do Vôlei - Resultados da Votação*\n\n`;
    message += `Total de ${totalVotes} ${totalVotes === 1 ? 'voto' : 'votos'}\n\n`;

    Object.entries(results).forEach(([category, candidates]) => {
      const categoryName = categoryNames[category] || category;
      message += `*${categoryName}*\n`;
      
      const sortedCandidates = Object.entries(candidates).sort(
        ([, a], [, b]) => b - a
      );

      sortedCandidates.forEach(([candidate, votes], index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '▫️';
        message += `${medal} ${candidate}: ${votes} ${votes === 1 ? 'voto' : 'votos'}\n`;
      });
      
      message += '\n';
    });

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (totalVotes === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ainda não há votos registrados.</p>
        </CardContent>
      </Card>
    );
  }

  if (!isReleased) {
    return (
      <Card className="mt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold">🔒 Resultados em Sigilo</p>
            <p className="text-sm text-muted-foreground">
              Os resultados serão revelados em breve pelo administrador
            </p>
            <p className="text-sm font-medium text-primary">
              {totalVotes} {totalVotes === 1 ? 'voto registrado' : 'votos registrados'}
            </p>
          </div>
        </div>
        <CardHeader>
          <CardTitle>Resultados - Total de {totalVotes} votos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 blur-md select-none pointer-events-none">
          {Object.entries(results).map(([category, candidates]) => {
            const sortedCandidates = Object.entries(candidates).sort(
              ([, a], [, b]) => b - a
            );
            const maxVotes = Math.max(...Object.values(candidates));

            return (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-lg">
                  {categoryNames[category] || category}
                </h3>
                <div className="space-y-2">
                  {sortedCandidates.map(([candidate, votes]) => (
                    <div key={candidate} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{candidate}</span>
                        <span className="text-muted-foreground">
                          ??? votos
                        </span>
                      </div>
                      <Progress value={(votes / maxVotes) * 100} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 border-2 border-primary/50 shadow-2xl shadow-primary/20 animate-fade-in-up">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              🏆 Resultados
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-green-500">
                ✅ {totalConfirmedVotes} Confirmados
              </Badge>
              {isAdmin && totalPendingVotes > 0 && (
                <Badge className="bg-yellow-500">
                  ⏳ {totalPendingVotes} Pendentes
                </Badge>
              )}
            </div>
          </div>
          <Button
            onClick={handleShareWhatsApp}
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar no WhatsApp
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(results).map(([category, candidates]) => {
          const sortedCandidates = Object.entries(candidates).sort(
            ([, a], [, b]) => b - a
          );
          const maxVotes = Math.max(...Object.values(candidates));

          return (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg">
                {categoryNames[category] || category}
              </h3>
              <div className="space-y-3">
                {sortedCandidates.map(([candidate, votes], index) => {
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '▫️';
                  return (
                    <div key={candidate} className="space-y-1 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex justify-between text-sm items-center">
                        <span className="font-medium flex items-center gap-2">
                          <span className="text-xl">{medal}</span>
                          {candidate}
                        </span>
                        <span className="text-muted-foreground font-semibold">
                          {votes} {votes === 1 ? 'voto' : 'votos'}
                        </span>
                      </div>
                      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ 
                            width: `${(votes / maxVotes) * 100}%`,
                            animation: 'progress-fill 1s ease-out'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
