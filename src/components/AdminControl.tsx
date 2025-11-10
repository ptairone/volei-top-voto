import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { validateAdminCode, setAdminSession, clearAdminSession, isAdminAuthenticated } from '@/utils/adminAuth';
import { Lock, Unlock, Shield } from 'lucide-react';

interface AdminControlProps {
  resultsReleased: boolean;
  onToggleResults: () => void;
}

export const AdminControl = ({ resultsReleased, onToggleResults }: AdminControlProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogin = () => {
    if (validateAdminCode(adminCode)) {
      setAdminSession();
      setIsAuthenticated(true);
      setError('');
      setAdminCode('');
    } else {
      setError('Código incorreto');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
          title="Admin Control (Ctrl+Alt+A)"
        >
          <Shield className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🔐 Painel Admin</DialogTitle>
        </DialogHeader>
        
        {!isAuthenticated ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Digite o código admin"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button onClick={handleLogin} className="w-full">
                Entrar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Controle de Resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  {resultsReleased ? (
                    <Unlock className="h-5 w-5 text-green-500" />
                  ) : (
                    <Lock className="h-5 w-5 text-orange-500" />
                  )}
                  <span className="font-medium">
                    Status: {resultsReleased ? 'Liberados' : 'Bloqueados'}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={onToggleResults}
                className="w-full"
                variant={resultsReleased ? "destructive" : "default"}
              >
                {resultsReleased ? '🔒 Bloquear Resultados' : '🔓 Liberar Resultados'}
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                Sair
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};
