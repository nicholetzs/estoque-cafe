import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { toast } from 'sonner';

export default function Relatorios() {
  const { products, movements } = useInventoryStore();
  const [selectedYear] = useState(new Date().getFullYear());

  // Análise de vendas por categoria
  const salesByCategory = useMemo(() => {
    const categories = ['Café', 'Pimenta', 'Cacau', 'Outros'];
    return categories.map(cat => {
      const categoryProducts = products.filter(p => p.category === cat);
      const totalValue = categoryProducts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
      const totalQuantity = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);
      return { category: cat, value: totalValue, quantity: totalQuantity };
    });
  }, [products]);

  // Análise de movimentações por mês
  const movementsByMonth = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((month, idx) => {
      const monthMovements = movements.filter(m => {
        const date = new Date(m.date);
        return date.getMonth() === idx && date.getFullYear() === selectedYear;
      });
      const entradas = monthMovements
        .filter(m => m.type === 'entrada')
        .reduce((sum, m) => sum + m.quantity, 0);
      const saidas = monthMovements
        .filter(m => m.type === 'saida')
        .reduce((sum, m) => sum + m.quantity, 0);
      const saldo = entradas - saidas;
      return { month, entradas, saidas, saldo };
    });
  }, [movements, selectedYear]);

  // Produtos com estoque baixo
  const lowStockProducts = useMemo(() => {
    return products
      .filter(p => p.quantity < p.minStock)
      .sort((a, b) => a.quantity - b.quantity)
      .map(p => ({
        name: p.name,
        current: p.quantity,
        minimum: p.minStock,
        deficit: p.minStock - p.quantity,
      }));
  }, [products]);

  // Produtos com maior valor em estoque
  const topValueProducts = useMemo(() => {
    return products
      .map(p => ({
        name: p.name.substring(0, 15),
        value: p.quantity * p.unitPrice,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [products]);

  // Rotatividade de estoque
  const turnoverAnalysis = useMemo(() => {
    return products.map(p => {
      const productMovements = movements.filter(m => m.productId === p.id);
      const totalMoved = productMovements.reduce((sum, m) => sum + m.quantity, 0);
      return {
        name: p.name.substring(0, 10),
        quantity: p.quantity,
        moved: totalMoved,
        turnover: totalMoved > 0 ? ((totalMoved / (p.quantity + totalMoved)) * 100).toFixed(1) : 0,
      };
    }).sort((a, b) => parseFloat(b.turnover as string) - parseFloat(a.turnover as string)).slice(0, 8);
  }, [products, movements]);

  const handleExportReport = () => {
    const report = {
      date: new Date().toLocaleDateString('pt-BR'),
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0),
      totalMovements: movements.length,
      salesByCategory,
      lowStockProducts,
      topValueProducts,
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2)));
    element.setAttribute('download', `relatorio-estoque-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Relatório exportado com sucesso');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-accent mb-2">Relatórios</h1>
          <p className="text-muted-foreground">Análises detalhadas do seu estoque</p>
        </div>
        <Button
          onClick={handleExportReport}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              R$ {products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Todos os produtos</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos em Alerta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Estoque abaixo do mínimo</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Movimentações Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{movements.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registradas no sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="sales">Vendas por Categoria</TabsTrigger>
          <TabsTrigger value="movement">Movimentação Mensal</TabsTrigger>
          <TabsTrigger value="lowstock">Estoque Baixo</TabsTrigger>
          <TabsTrigger value="topvalue">Top Produtos</TabsTrigger>
          <TabsTrigger value="turnover">Rotatividade</TabsTrigger>
        </TabsList>

        {/* Sales by Category */}
        <TabsContent value="sales">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Valor em Estoque por Categoria</CardTitle>
              <CardDescription>Distribuição do investimento</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3530" />
                  <XAxis dataKey="category" stroke="#a89878" />
                  <YAxis stroke="#a89878" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2420', border: '1px solid #3a3530' }}
                    labelStyle={{ color: '#e8dcc8' }}
                  />
                  <Bar dataKey="value" fill="#c9a961" name="Valor (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Movement by Month */}
        <TabsContent value="movement">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Movimentação Mensal - {selectedYear}</CardTitle>
              <CardDescription>Entradas, saídas e saldo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={movementsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3530" />
                  <XAxis dataKey="month" stroke="#a89878" />
                  <YAxis stroke="#a89878" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2420', border: '1px solid #3a3530' }}
                    labelStyle={{ color: '#e8dcc8' }}
                  />
                  <Area type="monotone" dataKey="entradas" stackId="1" fill="#c9a961" stroke="#c9a961" name="Entradas" />
                  <Area type="monotone" dataKey="saidas" stackId="1" fill="#8b6f47" stroke="#8b6f47" name="Saídas" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Low Stock */}
        <TabsContent value="lowstock">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Produtos com Estoque Baixo</CardTitle>
              <CardDescription>{lowStockProducts.length} produtos precisam reposição</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-accent">Produto</th>
                      <th className="text-right py-3 px-4 font-semibold text-accent">Atual</th>
                      <th className="text-right py-3 px-4 font-semibold text-accent">Mínimo</th>
                      <th className="text-right py-3 px-4 font-semibold text-accent">Déficit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 text-foreground">{product.name}</td>
                        <td className="py-3 px-4 text-right text-red-500 font-medium">{product.current}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{product.minimum}</td>
                        <td className="py-3 px-4 text-right text-red-500 font-bold">-{product.deficit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {lowStockProducts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Todos os produtos estão com estoque adequado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Value Products */}
        <TabsContent value="topvalue">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Top 10 Produtos por Valor em Estoque</CardTitle>
              <CardDescription>Maior investimento em estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topValueProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3530" />
                  <XAxis type="number" stroke="#a89878" />
                  <YAxis dataKey="name" type="category" stroke="#a89878" width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2420', border: '1px solid #3a3530' }}
                    labelStyle={{ color: '#e8dcc8' }}
                  />
                  <Bar dataKey="value" fill="#c9a961" name="Valor (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Turnover Analysis */}
        <TabsContent value="turnover">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Análise de Rotatividade</CardTitle>
              <CardDescription>Produtos mais movimentados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3530" />
                  <XAxis dataKey="quantity" name="Quantidade em Estoque" stroke="#a89878" />
                  <YAxis dataKey="moved" name="Quantidade Movimentada" stroke="#a89878" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2420', border: '1px solid #3a3530' }}
                    labelStyle={{ color: '#e8dcc8' }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Scatter name="Produtos" data={turnoverAnalysis} fill="#c9a961" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
