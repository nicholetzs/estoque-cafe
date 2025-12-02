import { useState } from "react";
import {
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Package,
  FileText,
  Activity,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useInventoryStore } from "../lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";

export default function Movimentacoes() {
  const { products, movements, addMovement } = useInventoryStore();
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  type FormData = {
    productId: string;
    type: "entrada" | "saida";
    quantity: number;
    notes: string;
  };

  const [formData, setFormData] = useState<FormData>({
    productId: "",
    type: "entrada",
    quantity: 0,
    notes: "",
  });

  const handleSave = () => {
    if (!formData.productId) {
      toast.error("Selecione um produto");
      return;
    }

    if (formData.quantity <= 0) {
      toast.error("Quantidade deve ser maior que 0");
      return;
    }

    addMovement({
      ...formData,
      date: new Date().toISOString(),
    });

    toast.success(`Movimentação registrada com sucesso!`);
    setFormData({
      productId: "",
      type: "entrada",
      quantity: 0,
      notes: "",
    });
    setOpen(false);
  };

  const getProductName = (productId: string) => {
    return (
      products.find(p => p.id === productId)?.name || "Produto desconhecido"
    );
  };

  const sortedMovements = [...movements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(m => {
      const matchesType = !filterType || m.type === filterType;
      const matchesSearch = getProductName(m.productId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });

  const stats = {
    total: movements.length,
    entradas: movements.filter(m => m.type === "entrada").length,
    saidas: movements.filter(m => m.type === "saida").length,
    today: movements.filter(m => {
      const today = new Date().toDateString();
      return new Date(m.date).toDateString() === today;
    }).length,
  };

  return (
    <div className="flex flex-row w-full bg-gradient-to-br from-[#0D0907] via-[#1A0F0A] to-[#0D0907] p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Premium com Stats */}
        <div className="flex w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#8B6F47] to-[#A0826D] p-10 shadow-2xl">
          <div className="flex w-full z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-[#FFF8E7]/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Activity className="w-8 h-8 text-[#FFF8E7]" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-[#FFF8E7]">
                      Movimentações
                    </h1>
                    <p className="text-[#FFF8E7]/80 text-lg mt-1">
                      Controle total de entradas e saídas do estoque
                    </p>
                  </div>
                </div>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#FFF8E7] hover:bg-[#FFF8E7]/90 text-[#6F4E37] h-12 px-6 shadow-xl font-semibold"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Movimentação
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] border-[#6F4E37]/30 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-[#E8DCC8]">
                      Registrar Movimentação
                    </DialogTitle>
                    <DialogDescription className="text-[#8B6F47]">
                      Registre uma nova entrada ou saída no estoque
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-5 py-4">
                    <div>
                      <label className="text-sm font-semibold text-[#C4A57B] mb-2  flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Produto
                      </label>
                      <Select
                        value={formData.productId}
                        onValueChange={value =>
                          setFormData({ ...formData, productId: value })
                        }
                      >
                        <SelectTrigger className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] h-11">
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2C1810] border-[#6F4E37]/30">
                          {products.map(product => (
                            <SelectItem
                              key={product.id}
                              value={product.id}
                              className="text-[#E8DCC8] focus:bg-[#3D2415]"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{product.name}</span>
                                <Badge className="ml-2 bg-[#6F4E37]/20 text-[#C4A57B]">
                                  {product.quantity} un
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#C4A57B] mb-2 block">
                        Tipo de Movimentação
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, type: "entrada" })
                          }
                          className={`h-20 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                            formData.type === "entrada"
                              ? "bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20"
                              : "bg-[#1A0F0A] border-[#6F4E37]/30 hover:border-green-500/50"
                          }`}
                        >
                          <ArrowDownCircle
                            className={`w-8 h-8 ${
                              formData.type === "entrada"
                                ? "text-green-400"
                                : "text-[#8B6F47]"
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              formData.type === "entrada"
                                ? "text-green-400"
                                : "text-[#C4A57B]"
                            }`}
                          >
                            Entrada
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, type: "saida" })
                          }
                          className={`h-20 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                            formData.type === "saida"
                              ? "bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20"
                              : "bg-[#1A0F0A] border-[#6F4E37]/30 hover:border-red-500/50"
                          }`}
                        >
                          <ArrowUpCircle
                            className={`w-8 h-8 ${
                              formData.type === "saida"
                                ? "text-red-400"
                                : "text-[#8B6F47]"
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              formData.type === "saida"
                                ? "text-red-400"
                                : "text-[#C4A57B]"
                            }`}
                          >
                            Saída
                          </span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#C4A57B] mb-2 block">
                        Quantidade
                      </label>
                      <Input
                        type="number"
                        value={formData.quantity}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] h-11 text-lg font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#C4A57B] mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Observações
                      </label>
                      <Textarea
                        value={formData.notes}
                        onChange={e =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="Ex: Compra fornecedor, Venda para cliente, Ajuste de inventário..."
                        className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] placeholder:text-[#8B6F47] min-h-[100px] resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-[#6F4E37]/30">
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="border-[#6F4E37]/30 hover:bg-[#3D2415] text-[#C4A57B] h-11"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-[#6F4E37] to-[#8B6F47] hover:opacity-90 text-[#FFF8E7] h-11 px-6"
                    >
                      Registrar Movimentação
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#FFF8E7]/10 backdrop-blur-sm rounded-xl p-4 border border-[#FFF8E7]/20">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-[#FFF8E7]" />
                  <span className="text-xs text-[#FFF8E7]/70 font-medium">
                    TOTAL
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#FFF8E7]">
                  {stats.total}
                </p>
              </div>

              <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <ArrowDownCircle className="w-5 h-5 text-green-400" />
                  <span className="text-xs text-green-400/70 font-medium">
                    ENTRADAS
                  </span>
                </div>
                <p className="text-3xl font-bold text-green-400">
                  {stats.entradas}
                </p>
              </div>

              <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <ArrowUpCircle className="w-5 h-5 text-red-400" />
                  <span className="text-xs text-red-400/70 font-medium">
                    SAÍDAS
                  </span>
                </div>
                <p className="text-3xl font-bold text-red-400">
                  {stats.saidas}
                </p>
              </div>

              <div className="bg-[#FFF8E7]/10 backdrop-blur-sm rounded-xl p-4 border border-[#FFF8E7]/20">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-[#FFF8E7]" />
                  <span className="text-xs text-[#FFF8E7]/70 font-medium">
                    HOJE
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#FFF8E7]">
                  {stats.today}
                </p>
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFF8E7]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFF8E7]/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] border-[#6F4E37]/30 shadow-xl">
          <CardContent className="p-6">
            <div className="flex gap-4 flex-wrap items-center">
              <div className="relative flex-1 min-w-[300px]">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
                <Input
                  placeholder="Buscar por produto..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-11 bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] placeholder:text-[#8B6F47] h-12"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#8B6F47]" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] w-[200px] h-12">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2C1810] border-[#6F4E37]/30">
                    <SelectItem
                      value="entrada"
                      className="text-[#E8DCC8] focus:bg-[#3D2415]"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowDownCircle className="w-4 h-4 text-green-500" />
                        Entradas
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="saida"
                      className="text-[#E8DCC8] focus:bg-[#3D2415]"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowUpCircle className="w-4 h-4 text-red-500" />
                        Saídas
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {filterType && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilterType("")}
                    className="text-[#8B6F47] hover:text-[#E8DCC8] hover:bg-[#3D2415]"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline de Movimentações */}
        {sortedMovements.length === 0 ? (
          <Card className="bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] border-[#6F4E37]/30 shadow-xl">
            <CardContent className="p-16">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#3D2415] rounded-full flex items-center justify-center mx-auto">
                  <Activity className="w-10 h-10 text-[#8B6F47]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#E8DCC8] mb-2">
                    Nenhuma movimentação encontrada
                  </h3>
                  <p className="text-[#8B6F47]">
                    Comece registrando suas primeiras entradas e saídas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedMovements.map((movement, index) => {
              const isEntrada = movement.type === "entrada";
              const date = new Date(movement.date);

              return (
                <Card
                  key={movement.id}
                  className="bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] border-[#6F4E37]/30 hover:border-[#8B6F47] transition-all duration-300 hover:shadow-xl hover:shadow-[#6F4E37]/10 group overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Icon & Type */}
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          isEntrada
                            ? "bg-green-500/10 border-2 border-green-500/30"
                            : "bg-red-500/10 border-2 border-red-500/30"
                        }`}
                      >
                        {isEntrada ? (
                          <ArrowDownCircle className="w-8 h-8 text-green-400" />
                        ) : (
                          <ArrowUpCircle className="w-8 h-8 text-red-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[#E8DCC8] group-hover:text-[#FFF8E7] transition-colors">
                            {getProductName(movement.productId)}
                          </h3>
                          <Badge
                            className={`${
                              isEntrada
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            } border`}
                          >
                            {isEntrada ? "Entrada" : "Saída"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-[#8B6F47]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {date.toLocaleDateString("pt-BR")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {date.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {movement.notes && (
                          <p className="text-sm text-[#C4A57B] mt-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {movement.notes}
                          </p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="text-right">
                        <div
                          className={`text-3xl font-bold ${
                            isEntrada ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {isEntrada ? "+" : "-"}
                          {movement.quantity}
                        </div>
                        <p className="text-xs text-[#8B6F47] mt-1">unidades</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
