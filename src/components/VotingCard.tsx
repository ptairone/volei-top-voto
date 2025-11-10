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
  disabled: boolean;
}

export const VotingCard = ({
  category,
  title,
  description,
  icon,
  onVote,
  disabled,
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
    <Card className="border-2 hover:border-primary transition-colors">
      <CardHeader>
        <div className="text-4xl mb-2">{icon}</div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`candidate-${category}`}>Nome do jogador</Label>
            <Input
              id={`candidate-${category}`}
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
              placeholder="Digite o nome..."
              disabled={disabled}
              maxLength={50}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={disabled || !candidate.trim()}
          >
            {disabled ? 'Você já votou' : 'Votar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
