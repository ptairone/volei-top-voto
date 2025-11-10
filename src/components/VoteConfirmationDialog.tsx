import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Copy, CheckCircle } from 'lucide-react';
import { sendVoteConfirmation } from '@/utils/whatsappConfirmation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voteCode: string;
  category: string;
  candidate: string;
}

export const VoteConfirmationDialog = ({
  open,
  onOpenChange,
  voteCode,
  category,
  candidate,
}: VoteConfirmationDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const categoryNames: Record<string, string> = {
    'melhor-saque': 'Melhor Saque',
    'mais-reclamao': 'Mais Reclamação',
    'mais-gente-boa': 'Mais Gente Boa',
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voteCode);
    setCopied(true);
    toast({
      title: 'Código copiado!',
      description: 'O código foi copiado para a área de transferência.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    sendVoteConfirmation(voteCode, category, candidate);
    toast({
      title: 'WhatsApp aberto!',
      description: 'Clique em ENVIAR no WhatsApp para confirmar seu voto.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Voto Registrado!
          </DialogTitle>
          <DialogDescription className="text-base">
            Confirme seu voto enviando o código via WhatsApp
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">Código do Voto:</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-2xl font-bold font-mono tracking-wider">{voteCode}</p>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className="shrink-0"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p><strong>Categoria:</strong> {categoryNames[category]}</p>
            <p><strong>Candidato:</strong> {candidate}</p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              ⚠️ <strong>Importante:</strong> Seu voto só será contabilizado após o envio da confirmação no WhatsApp!
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Como confirmar:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Clique no botão abaixo para abrir o WhatsApp</li>
              <li>A mensagem já estará pronta com seu código</li>
              <li>Basta clicar em <strong>ENVIAR</strong> no WhatsApp</li>
            </ol>
          </div>

          <Button
            onClick={handleSendWhatsApp}
            className="w-full"
            size="lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Enviar Confirmação via WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
