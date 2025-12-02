import { useState } from "react";
import {
  Trash2,
  Edit2,
  Plus,
  Search,
  Filter,
  Package2,
  TrendingUp,
  AlertCircle,
  Coffee,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Product, useInventoryStore } from "../lib/store";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function Produtos() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useInventoryStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [formData, setFormData] = useState<{
    name: string;
    category: "Café" | "Pimenta" | "Cacau" | "Outros";
    quantity: number;
    unitPrice: number;
    minStock: number;
  }>({
    name: "",
    category: "Café",
    quantity: 0,
    unitPrice: 0,
    minStock: 0,
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        minStock: product.minStock,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        category: "Café",
        quantity: 0,
        unitPrice: 0,
        minStock: 0,
      });
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Nome do produto é obrigatório");
      return;
    }

    if (editingId) {
      updateProduct(editingId, formData);
      toast.success("Produto atualizado com sucesso!");
    } else {
      addProduct(formData);
      toast.success("Produto adicionado com sucesso!");
    }

    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este produto?")) {
      deleteProduct(id);
      toast.success("Produto deletado com sucesso!");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Café":
        return <Coffee className="w-4 h-4" />;
      case "Pimenta":
        return <Sparkles className="w-4 h-4" />;
      case "Cacau":
        return <Package2 className="w-4 h-4" />;
      default:
        return <Package2 className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Café":
        return "bg-[#6F4E37] text-[#FFF8E7]";
      case "Pimenta":
        return "bg-red-800 text-red-100";
      case "Cacau":
        return "bg-amber-800 text-amber-100";
      default:
        return "bg-[#8B6F47] text-[#FFF8E7]";
    }
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) {
      return {
        label: "Esgotado",
        color: "bg-red-500/10 text-red-500 border-red-500/20",
      };
    } else if (quantity < minStock) {
      return {
        label: "Estoque Baixo",
        color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      };
    } else {
      return {
        label: "Em Estoque",
        color: "bg-green-500/10 text-green-500 border-green-500/20",
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0907] via-[#1A0F0A] to-[#0D0907] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Premium */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#8B6F47] to-[#A0826D] p-10 shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-[#FFF8E7]/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Package2 className="w-8 h-8 text-[#FFF8E7]" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-[#FFF8E7]">
                      Catálogo de Produtos
                    </h1>
                    <p className="text-[#FFF8E7]/80 text-lg mt-1">
                      Gerencie sua coleção de produtos especiais
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-[#FFF8E7]/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Package2 className="w-4 h-4 text-[#FFF8E7]" />
                    <span className="text-[#FFF8E7] font-semibold">
                      {products.length} produtos
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFF8E7]/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-[#FFF8E7]" />
                    <span className="text-[#FFF8E7] font-semibold">
                      R${" "}
                      {products
                        .reduce((sum, p) => sum + p.quantity * p.unitPrice, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-[#FFF8E7] hover:bg-[#FFF8E7]/90 text-[#6F4E37] h-12 px-6 shadow-xl font-semibold"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] border-[#6F4E37]/30 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-[#E8DCC8]">
                      {editingId ? "Editar Produto" : "Novo Produto"}
                    </DialogTitle>
                    <DialogDescription className="text-[#8B6F47]">
                      {editingId
                        ? "Atualize as informações do produto"
                        : "Adicione um novo produto especial ao catálogo"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-5 py-4">
                    <div>
                      <label className="text-sm font-semibold text-[#C4A57B] mb-2 block">
                        Nome do Produto
                      </label>
                      <Input
                        value={formData.name}
                        onChange={e =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Ex: Café Arábica Premium da Fazenda Sol Nascente"
                        className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] placeholder:text-[#8B6F47] h-11"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#C4A57B] mb-2 block">
                        Categoria
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(
                          value: "Café" | "Pimenta" | "Cacau" | "Outros"
                        ) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2C1810] border-[#6F4E37]/30">
                          <SelectItem
                            value="Café"
                            className="text-[#E8DCC8] focus:bg-[#3D2415]"
                          >
                            <div className="flex items-center gap-2">
                              <Coffee className="w-4 h-4" />
                              Café
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="Pimenta"
                            className="text-[#E8DCC8] focus:bg-[#3D2415]"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Pimenta
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="Cacau"
                            className="text-[#E8DCC8] focus:bg-[#3D2415]"
                          >
                            <div className="flex items-center gap-2">
                              <Package2 className="w-4 h-4" />
                              Cacau
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="Outros"
                            className="text-[#E8DCC8] focus:bg-[#3D2415]"
                          >
                            Outros
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-[#C4A57B] mb-2 block">
                          Quantidade em Estoque
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
                          className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] h-11"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#C4A57B] mb-2 block">
                          Preço Unitário (R$)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.unitPrice}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              unitPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                          className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] h-11"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[#C4A57B] mb-2 block">
                        Estoque Mínimo Alerta
                      </label>
                      <Input
                        type="number"
                        value={formData.minStock}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            minStock: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] h-11"
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
                      {editingId ? "Atualizar Produto" : "Adicionar Produto"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFF8E7]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFF8E7]/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
        </div>

        {/* Filters Premium */}
        <Card className="bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] border-[#6F4E37]/30 shadow-xl">
          <CardContent className="p-6">
            <div className="flex gap-4 flex-wrap items-center">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
                <Input
                  placeholder="Buscar produtos pelo nome..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-11 bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] placeholder:text-[#8B6F47] h-12"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#8B6F47]" />
                <Select
                  value={selectedCategory || undefined}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] w-[220px] h-12">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2C1810] border-[#6F4E37]/30">
                    <SelectItem
                      value="Café"
                      className="text-[#E8DCC8] focus:bg-[#3D2415]"
                    >
                      Café
                    </SelectItem>
                    <SelectItem
                      value="Pimenta"
                      className="text-[#E8DCC8] focus:bg-[#3D2415]"
                    >
                      Pimenta
                    </SelectItem>
                    <SelectItem
                      value="Cacau"
                      className="text-[#E8DCC8] focus:bg-[#3D2415]"
                    >
                      Cacau
                    </SelectItem>
                    <SelectItem
                      value="Outros"
                      className="text-[#E8DCC8] focus:bg-[#3D2415]"
                    >
                      Outros
                    </SelectItem>
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory("")}
                    className="text-[#8B6F47] hover:text-[#E8DCC8] hover:bg-[#3D2415]"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid Premium */}
        {filteredProducts.length === 0 ? (
          <Card className="bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] border-[#6F4E37]/30 shadow-xl">
            <CardContent className="p-16">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#3D2415] rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-10 h-10 text-[#8B6F47]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#E8DCC8] mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-[#8B6F47]">
                    Tente ajustar os filtros ou adicione novos produtos ao
                    catálogo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(
                product.quantity,
                product.minStock
              );

              return (
                <Card
                  key={product.id}
                  className="bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] border-[#6F4E37]/30 hover:border-[#8B6F47] transition-all duration-300 hover:shadow-2xl hover:shadow-[#6F4E37]/20 group overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        className={`${getCategoryColor(product.category)} flex items-center gap-1 px-3 py-1`}
                      >
                        {getCategoryIcon(product.category)}
                        {product.category}
                      </Badge>
                      <Badge
                        className={`${stockStatus.color} border px-3 py-1`}
                      >
                        {stockStatus.label}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-[#E8DCC8] group-hover:text-[#FFF8E7] transition-colors line-clamp-2">
                      {product.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#1A0F0A] rounded-lg p-3 border border-[#6F4E37]/20">
                        <p className="text-xs text-[#8B6F47] mb-1">
                          Quantidade
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            product.quantity < product.minStock
                              ? "text-yellow-500"
                              : product.quantity === 0
                                ? "text-red-500"
                                : "text-[#C4A57B]"
                          }`}
                        >
                          {product.quantity}
                        </p>
                      </div>

                      <div className="bg-[#1A0F0A] rounded-lg p-3 border border-[#6F4E37]/20">
                        <p className="text-xs text-[#8B6F47] mb-1">
                          Preço Unit.
                        </p>
                        <p className="text-2xl font-bold text-[#C4A57B]">
                          R$ {product.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Total Value */}
                    <div className="bg-gradient-to-r from-[#6F4E37]/20 to-[#8B6F47]/20 rounded-lg p-4 border border-[#6F4E37]/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#8B6F47] mb-1">
                            Valor Total em Estoque
                          </p>
                          <p className="text-2xl font-bold text-[#E8DCC8]">
                            R${" "}
                            {(product.quantity * product.unitPrice).toFixed(2)}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-[#8B6F47]" />
                      </div>
                    </div>

                    {/* Min Stock Alert */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8B6F47]">Estoque mínimo:</span>
                      <span className="text-[#C4A57B] font-semibold">
                        {product.minStock} unidades
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleOpenDialog(product)}
                        className="flex-1 bg-[#3D2415] hover:bg-[#6F4E37] text-[#C4A57B] hover:text-[#FFF8E7] border border-[#6F4E37]/30"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
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
