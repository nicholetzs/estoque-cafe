import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInventoryStore } from '@/lib/store';

const COLORS = ['#c9a961', '#d4b896', '#8b6f47', '#6b5636'];

export default function Dashboard() {
  const { products, movements } = useInventoryStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  // Dados agregados
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    const totalMovements = movements.length;
    const lowStockProducts = products.filter(p => p.quantity < 10).length;

    return { totalProducts, totalValue, totalMovements, lowStockProducts };
  }, [products, movements]);

  // Dados mensais
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const data = months.map((month, idx) => {
      const monthMovements = movements.filter(m => {
        const date = new Date(m.date);
        return date.getMonth() === idx && date.getFullYear() === selectedYear;
      });
      const entrada = monthMovements.filter(m => m.type === 'entrada').reduce((sum, m) => sum + m.quantity, 0);
      const saida = monthMovements.filter(m => m.type === 'saida').reduce((sum, m) => sum + m.quantity, 0);
      return { month, entrada, saida };
    });
    return data;
  }, [movements, selectedYear]);

  // Dados por categoria
  const categoryData = useMemo(() => {
    const categories = ['Café', 'Pimenta', 'Cacau', 'Outros'];
    return categories.map(cat => {
      const total = products
        .filter(p => p.category === cat)
        .reduce((sum, p) => sum + p.quantity, 0);
      return { name: cat, value: total };
    });
  }, [products]);

  // Dados de estoque por produto
  const productStockData = useMemo(() => {
    return products.slice(0, 8).map(p => ({
      name: p.name.substring(0, 10),
      quantity: p.quantity,
      value: (p.quantity * p.unitPrice).toFixed(2),
    }));
  }, [products]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-accent mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu controle de estoque</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border hover:border-accent transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-accent transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">R$ {stats.totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Valor do estoque</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-accent transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.totalMovements}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de movimentos</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-accent transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stats.lowStockProducts > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {stats.lowStockProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Produtos com alerta</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="monthly">Análise Mensal</TabsTrigger>
          <TabsTrigger value="annual">Análise Anual</TabsTrigger>
          <TabsTrigger value="category">Por Categoria</TabsTrigger>
          <TabsTrigger value="products">Estoque por Produto</TabsTrigger>
        </TabsList>

        {/* Monthly Analysis */}
        <TabsContent value="monthly">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Movimentação Mensal - {selectedYear}</CardTitle>
              <CardDescription>Entradas e saídas por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3530" />
                  <XAxis dataKey="month" stroke="#a89878" />
                  <YAxis stroke="#a89878" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2420', border: '1px solid #3a3530' }}
                    labelStyle={{ color: '#e8dcc8' }}
                  />
                  <Legend />
                  <Bar dataKey="entrada" fill="#c9a961" name="Entradas" />
                  <Bar dataKey="saida" fill="#8b6f47" name="Saídas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Annual Analysis */}
        <TabsContent value="annual">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Tendência Anual - {selectedYear}</CardTitle>
              <CardDescription>Evolução de entradas e saídas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3530" />
                  <XAxis dataKey="month" stroke="#a89878" />
                  <YAxis stroke="#a89878" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2420', border: '1px solid #3a3530' }}
                    labelStyle={{ color: '#e8dcc8' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="entrada" stroke="#c9a961" strokeWidth={2} name="Entradas" />
                  <Line type="monotone" dataKey="saida" stroke="#8b6f47" strokeWidth={2} name="Saídas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Distribution */}
        <TabsContent value="category">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
              <CardDescription>Quantidade de produtos em estoque</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2420', border: '1px solid #3a3530' }}
                    labelStyle={{ color: '#e8dcc8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Stock */}
        <TabsContent value="products">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Estoque por Produto</CardTitle>
              <CardDescription>Top 8 produtos em estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productStockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a3530" />
                  <XAxis dataKey="name" stroke="#a89878" />
                  <YAxis stroke="#a89878" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2420', border: '1px solid #3a3530' }}
                    labelStyle={{ color: '#e8dcc8' }}
                  />
                  <Bar dataKey="quantity" fill="#c9a961" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
