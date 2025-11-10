import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VoteCategory } from '@/hooks/useVoting';

interface VotingCardProps {
  category: VoteCategory;
  title: string;
  description: string;
  icon: string;
  onVote: (category: VoteCategory, candidate: string) => void;
  hasVotedInCategory: boolean;
}

export const VotingCard = ({
  category,
  title,
  description,
  icon,
  onVote,
  hasVotedInCategory,
}: VotingCardProps) => {
  const [candidate, setCandidate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (candidate.trim()) {
      onVote(category, candidate.trim());
      setCandidate('');
    }
  };

  return (
    <Card className="group border-2 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 animate-float relative overflow-hidden rounded-2xl">
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent transform -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out]"></div>
      </div>
      
      <CardHeader className="relative z-10">
        <div className="text-5xl mb-2 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">{icon}</div>
        <CardTitle className="text-2xl group-hover:text-primary transition-colors">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`candidate-${category}`}>Nome do jogador</Label>
            <Input
              id={`candidate-${category}`}
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
              placeholder="Digite o nome..."
              disabled={hasVotedInCategory}
              maxLength={50}
              className="focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={hasVotedInCategory || !candidate.trim()}
          >
            {hasVotedInCategory ? '✅ Você já votou aqui' : '🗳️ Votar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
