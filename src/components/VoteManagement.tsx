import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import { VoteStatus, VoteCategory } from '@/hooks/useVoting';
import { useToast } from '@/hooks/use-toast';

interface Vote {
  voteCode: string;
  category: VoteCategory;
  candidate: string;
  timestamp: number;
  fingerprint: string;
  status: VoteStatus;
}

interface VoteManagementProps {
  votes: Vote[];
  onConfirm: (voteCode: string) => void;
  onReject: (voteCode: string) => void;
}

const categoryNames: Record<string, string> = {
  'melhor-saque': 'Melhor Saque',
  'mais-reclamao': 'Mais Reclamação',
  'mais-gente-boa': 'Mais Gente Boa',
};

const statusColors: Record<VoteStatus, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-500',
  rejected: 'bg-red-500',
};

const statusLabels: Record<VoteStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  rejected: 'Rejeitado',
};

export const VoteManagement = ({ votes, onConfirm, onReject }: VoteManagementProps) => {
  const [searchCode, setSearchCode] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { toast } = useToast();

  const handleConfirm = (voteCode: string) => {
    onConfirm(voteCode);
    toast({
      title: "Voto confirmado!",
      description: `Voto ${voteCode} foi confirmado com sucesso.`,
    });
  };

  const handleReject = (voteCode: string) => {
    onReject(voteCode);
    toast({
      title: "Voto rejeitado!",
      description: `Voto ${voteCode} foi rejeitado.`,
      variant: "destructive",
    });
  };

  const filterVotes = (votes: Vote[], status?: VoteStatus) => {
    let filtered = status ? votes.filter(v => v.status === status) : votes;
    
    if (searchCode) {
      filtered = filtered.filter(v => 
        v.voteCode.toLowerCase().includes(searchCode.toLowerCase()) ||
        v.candidate.toLowerCase().includes(searchCode.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(v => v.category === filterCategory);
    }
    
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  };

  const VoteCard = ({ vote }: { vote: Vote }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={statusColors[vote.status]}>{statusLabels[vote.status]}</Badge>
              <span className="font-mono text-sm font-bold">{vote.voteCode}</span>
            </div>
            <div className="text-sm space-y-1">
              <p><strong>Categoria:</strong> {categoryNames[vote.category]}</p>
              <p><strong>Candidato:</strong> {vote.candidate}</p>
              <p className="text-muted-foreground">
                {new Date(vote.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          
          {vote.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleConfirm(vote.voteCode)}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(vote.voteCode)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const pendingVotes = filterVotes(votes, 'pending');
  const confirmedVotes = filterVotes(votes, 'confirmed');
  const rejectedVotes = filterVotes(votes, 'rejected');
  const allVotes = filterVotes(votes);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">{votes.filter(v => v.status === 'pending').length}</p>
            <p className="text-sm text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{votes.filter(v => v.status === 'confirmed').length}</p>
            <p className="text-sm text-muted-foreground">Confirmados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{votes.filter(v => v.status === 'rejected').length}</p>
            <p className="text-sm text-muted-foreground">Rejeitados</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código ou candidato..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-input bg-background rounded-md"
        >
          <option value="all">Todas categorias</option>
          <option value="melhor-saque">Melhor Saque</option>
          <option value="mais-reclamao">Mais Reclamação</option>
          <option value="mais-gente-boa">Mais Gente Boa</option>
        </select>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pendentes ({pendingVotes.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmados ({confirmedVotes.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejeitados ({rejectedVotes.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todos ({allVotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pendingVotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum voto pendente</p>
          ) : (
            pendingVotes.map(vote => <VoteCard key={vote.voteCode} vote={vote} />)
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="mt-4">
          {confirmedVotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum voto confirmado</p>
          ) : (
            confirmedVotes.map(vote => <VoteCard key={vote.voteCode} vote={vote} />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {rejectedVotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum voto rejeitado</p>
          ) : (
            rejectedVotes.map(vote => <VoteCard key={vote.voteCode} vote={vote} />)
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          {allVotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum voto registrado</p>
          ) : (
            allVotes.map(vote => <VoteCard key={vote.voteCode} vote={vote} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
