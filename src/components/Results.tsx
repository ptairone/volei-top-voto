import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ResultsProps {
  results: {
    [category: string]: {
      [candidate: string]: number;
    };
  };
  totalVotes: number;
}

const categoryNames: { [key: string]: string } = {
  'melhor-saque': '🏐 Melhor Saque',
  'mais-reclamao': '😤 Mais Reclamão',
  'mais-gente-boa': '😊 Mais Gente Boa',
};

export const Results = ({ results, totalVotes }: ResultsProps) => {
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
