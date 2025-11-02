import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Coffee } from 'lucide-react';
import { Button } from './ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Dashboard', href: '/', icon: '📊' },
    { label: 'Produtos', href: '/produtos', icon: '📦' },
    { label: 'Movimentações', href: '/movimentacoes', icon: '↔️' },
    { label: 'Relatórios', href: '/relatorios', icon: '📈' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-accent-foreground" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-accent">ESTOQUE</h1>
                <p className="text-xs text-muted-foreground">Controle</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group">
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm font-medium group-hover:text-accent transition-colors">
                    {item.label}
                  </span>
                )}
              </a>
            </Link>
          ))}
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-accent">Sistema de Controle de Estoque</h2>
            <p className="text-sm text-muted-foreground">Gerenciamento de Café, Pimenta e Cacau</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">Bem-vindo</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
