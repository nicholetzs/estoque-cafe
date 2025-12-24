import { useState, useMemo } from "react";
import { useInventoryStore } from "../lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  Pie,
  Cell,
  BarChart,
  PieChart,
  Area,
  AreaChart,
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  TrendingUp,
  Package,
  DollarSign,
  Activity,
  AlertTriangle,
  Coffee,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const COLORS = ["#6F4E37", "#8B6F47", "#A0826D", "#C4A57B"];

export default function Dashboard() {
  const { products, movements } = useInventoryStore();
  const [selectedYear] = useState(new Date().getFullYear());

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.quantity * p.unitPrice,
      0
    );
    const totalMovements = movements.length;
    const lowStockProducts = products.filter(p => p.quantity < 10).length;

    // Calcular variação do mês anterior
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const currentMonthMovements = movements.filter(m => {
      const date = new Date(m.date);
      return date.getMonth() === currentMonth;
    }).length;

    const lastMonthMovements = movements.filter(m => {
      const date = new Date(m.date);
      return date.getMonth() === lastMonth;
    }).length;

    const movementChange =
      lastMonthMovements > 0
        ? (
            ((currentMonthMovements - lastMonthMovements) /
              lastMonthMovements) *
            100
          ).toFixed(1)
        : 0;

    return {
      totalProducts,
      totalValue,
      totalMovements,
      lowStockProducts,
      movementChange,
    };
  }, [products, movements]);

  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const data = months.map((month, idx) => {
      const monthMovements = movements.filter(m => {
        const date = new Date(m.date);
        return date.getMonth() === idx && date.getFullYear() === selectedYear;
      });
      const entrada = monthMovements
        .filter(m => m.type === "entrada")
        .reduce((sum, m) => sum + m.quantity, 0);
      const saida = monthMovements
        .filter(m => m.type === "saida")
        .reduce((sum, m) => sum + m.quantity, 0);
      const saldo = entrada - saida;
      return { month, entrada, saida, saldo };
    });
    return data;
  }, [movements, selectedYear]);

  const categoryData = useMemo(() => {
    const categories = ["Café", "Pimenta", "Cacau", "Outros"];
    return categories
      .map(cat => {
        const total = products
          .filter(p => p.category === cat)
          .reduce((sum, p) => sum + p.quantity, 0);
        return { name: cat, value: total };
      })
      .filter(item => item.value > 0);
  }, [products]);

  const productStockData = useMemo(() => {
    return products
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8)
      .map(p => ({
        name: p.name.substring(0, 15),
        quantity: p.quantity,
        value: (p.quantity * p.unitPrice).toFixed(2),
      }));
  }, [products]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2C1810] border border-[#6F4E37] rounded-lg p-3 shadow-xl">
          <p className="text-[#E8DCC8] font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0907] via-[#1A0F0A] to-[#0D0907] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header com gradiente */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#8B6F47] to-[#A0826D] p-8 shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Coffee className="w-10 h-10 text-[#FFF8E7]" />
              <h1 className="text-5xl font-bold text-[#FFF8E7]">Dashboard</h1>
            </div>
            <p className="text-[#FFF8E7]/80 text-lg">
              Visão geral do controle de estoque
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFF8E7]/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFF8E7]/5 rounded-full -ml-24 -mb-24"></div>
        </div>

        {/* KPI Cards com design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br cursor-pointer from-[#2C1810] to-[#3D2415] border-[#6F4E37] hover:border-[#8B6F47] transition-all duration-300 hover:shadow-2xl hover:shadow-[#6F4E37]/20 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#C4A57B]">
                  Total de Produtos
                </CardTitle>
                <Package className="w-5 h-5 text-[#8B6F47] group-hover:text-[#C4A57B] transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#E8DCC8] mb-1">
                {stats.totalProducts}
              </div>
              <p className="text-xs text-[#8B6F47] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Produtos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br cursor-pointer from-[#2C1810] to-[#3D2415] border-[#6F4E37] hover:border-[#8B6F47] transition-all duration-300 hover:shadow-2xl hover:shadow-[#6F4E37]/20 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#C4A57B]">
                  Valor Total
                </CardTitle>
                <DollarSign className="w-5 h-5 text-[#8B6F47] group-hover:text-[#C4A57B] transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#E8DCC8] mb-1">
                R${" "}
                {stats.totalValue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-[#8B6F47] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Valor do estoque
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br cursor-pointer from-[#2C1810] to-[#3D2415] border-[#6F4E37] hover:border-[#8B6F47] transition-all duration-300 hover:shadow-2xl hover:shadow-[#6F4E37]/20 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#C4A57B]">
                  Movimentações
                </CardTitle>
                <Activity className="w-5 h-5 text-[#8B6F47] group-hover:text-[#C4A57B] transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#E8DCC8] mb-1">
                {stats.totalMovements}
              </div>
              <p className="text-xs text-[#8B6F47] flex items-center gap-1">
                {Number(stats.movementChange) >= 0 ? (
                  <>
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">
                      +{stats.movementChange}%
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                    <span className="text-red-500">
                      {stats.movementChange}%
                    </span>
                  </>
                )}
                <span className="ml-1">vs mês anterior</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br  cursor-pointerfrom-[#2C1810] to-[#3D2415] border-[#6F4E37] hover:border-[#8B6F47] transition-all duration-300 hover:shadow-2xl hover:shadow-[#6F4E37]/20 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#C4A57B]">
                  Estoque Baixo
                </CardTitle>
                <AlertTriangle className="w-5 h-5 text-[#8B6F47] group-hover:text-[#C4A57B] transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-4xl font-bold mb-1 ${
                  stats.lowStockProducts > 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {stats.lowStockProducts}
              </div>
              <p className="text-xs text-[#8B6F47] flex items-center gap-1">
                {stats.lowStockProducts > 0 ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-red-400">Atenção necessária</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Estoque saudável</span>
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts com design aprimorado */}
        <Tabs defaultValue="monthly" className="space-y-6">
          <TabsList className="bg-[#2C1810] border border-[#6F4E37] p-1 rounded-xl">
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6F4E37] data-[state=active]:to-[#8B6F47] data-[state=active]:text-[#FFF8E7] rounded-lg"
            >
              Análise Mensal
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6F4E37] data-[state=active]:to-[#8B6F47] data-[state=active]:text-[#FFF8E7] rounded-lg"
            >
              Tendências
            </TabsTrigger>
            <TabsTrigger
              value="category"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6F4E37] data-[state=active]:to-[#8B6F47] data-[state=active]:text-[#FFF8E7] rounded-lg"
            >
              Categorias
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6F4E37] data-[state=active]:to-[#8B6F47] data-[state=active]:text-[#FFF8E7] rounded-lg"
            >
              Top Produtos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly">
            <Card className="bg-gradient-to-br from-[#2C1810] to-[#3D2415] border-[#6F4E37] shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#E8DCC8]">
                  Movimentação Mensal - {selectedYear}
                </CardTitle>
                <CardDescription className="text-[#8B6F47]">
                  Análise detalhada de entradas e saídas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyData}>
                    <defs>
                      <linearGradient
                        id="colorEntrada"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8B6F47"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8B6F47"
                          stopOpacity={0.3}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorSaida"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#C4A57B"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#C4A57B"
                          stopOpacity={0.3}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#6F4E37"
                      opacity={0.3}
                    />
                    <XAxis dataKey="month" stroke="#C4A57B" />
                    <YAxis stroke="#C4A57B" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: "#E8DCC8" }} />
                    <Bar
                      dataKey="entrada"
                      fill="url(#colorEntrada)"
                      name="Entradas"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="saida"
                      fill="url(#colorSaida)"
                      name="Saídas"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="annual">
            <Card className="bg-gradient-to-br from-[#0D0907] via-[#1A0F0A] to-[#0D0907] shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#E8DCC8]">
                  Tendência Anual - {selectedYear}
                </CardTitle>
                <CardDescription className="text-[#8B6F47]">
                  Evolução do saldo ao longo do ano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient
                        id="colorArea"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8B6F47"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8B6F47"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#6F4E37"
                      opacity={0.3}
                    />
                    <XAxis dataKey="month" stroke="#C4A57B" />
                    <YAxis stroke="#C4A57B" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: "#E8DCC8" }} />
                    <Area
                      type="monotone"
                      dataKey="entrada"
                      stroke="#8B6F47"
                      fillOpacity={1}
                      fill="url(#colorArea)"
                      strokeWidth={3}
                      name="Entradas"
                    />
                    <Line
                      type="monotone"
                      dataKey="saida"
                      stroke="#C4A57B"
                      strokeWidth={3}
                      name="Saídas"
                      dot={{ fill: "#C4A57B", r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category">
            <Card className="bg-gradient-to-br from-[#2C1810] to-[#3D2415] border-[#6F4E37] shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#E8DCC8]">
                  Distribuição por Categoria
                </CardTitle>
                <CardDescription className="text-[#8B6F47]">
                  Proporção de produtos em estoque
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => {
                        const { name, value, percent } = props;
                        return `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;
                      }}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#1A0F0A"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="bg-gradient-to-br from-[#2C1810] to-[#3D2415] border-[#6F4E37] shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#E8DCC8]">
                  Top 8 Produtos em Estoque
                </CardTitle>
                <CardDescription className="text-[#8B6F47]">
                  Produtos com maior quantidade disponível
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={productStockData} layout="vertical">
                    <defs>
                      <linearGradient
                        id="colorProduct"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6F4E37"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#C4A57B"
                          stopOpacity={0.8}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#6F4E37"
                      opacity={0.3}
                    />
                    <XAxis type="number" stroke="#C4A57B" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#C4A57B"
                      width={120}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="quantity"
                      fill="url(#colorProduct)"
                      name="Quantidade"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
