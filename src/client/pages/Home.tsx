import { useLocation } from 'wouter';
import { Home as HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6">
        <div className="text-6xl font-bold text-accent">404</div>
        <h1 className="text-4xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Button
          onClick={() => setLocation('/')}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <HomeIcon className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
}
