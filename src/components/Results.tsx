import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lock } from 'lucide-react';

interface ResultsProps {
  results: {
    [category: string]: {
      [candidate: string]: number;
    };
  };
  totalVotes: number;
  isReleased: boolean;
}

const categoryNames: { [key: string]: string } = {
  'melhor-saque': '🏐 Melhor Saque',
  'mais-reclamao': '😤 Mais Reclamão',
  'mais-gente-boa': '😊 Mais Gente Boa',
};

export const Results = ({ results, totalVotes, isReleased }: ResultsProps) => {
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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Resultados - Total de {totalVotes} votos</CardTitle>
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
              <div className="space-y-2">
                {sortedCandidates.map(([candidate, votes]) => (
                  <div key={candidate} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{candidate}</span>
                      <span className="text-muted-foreground">
                        {votes} {votes === 1 ? 'voto' : 'votos'}
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
};
