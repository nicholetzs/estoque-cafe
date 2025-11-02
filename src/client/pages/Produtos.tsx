import { useState } from 'react';

import { Trash2, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Product, useInventoryStore } from '../lib/store';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Produtos() {
  const { products, addProduct, updateProduct, deleteProduct } = useInventoryStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formData, setFormData] = useState<{
    name: string;
    category: 'Café' | 'Pimenta' | 'Cacau' | 'Outros';
    quantity: number;
    unitPrice: number;
    minStock: number;
  }>({
    name: '',
    category: 'Café',
    quantity: 0,
    unitPrice: 0,
    minStock: 0,
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
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
        name: '',
        category: 'Café',
        quantity: 0,
        unitPrice: 0,
        minStock: 0,
      });
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Nome do produto é obrigatório');
      return;
    }

    if (editingId) {
      updateProduct(editingId, formData);
      toast.success('Produto atualizado com sucesso');
    } else {
      addProduct(formData);
      toast.success('Produto adicionado com sucesso');
    }

    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      deleteProduct(id);
      toast.success('Produto deletado com sucesso');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-accent mb-2">Produtos</h1>
          <p className="text-muted-foreground">Gerenciar seu catálogo de produtos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-accent">
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'Atualize as informações do produto' : 'Adicione um novo produto ao seu estoque'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nome do Produto</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Café Arábica Premium"
                  className="bg-input border-border text-foreground mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Categoria</label>
                <Select value={formData.category} onValueChange={(value: 'Café' | 'Pimenta' | 'Cacau' | 'Outros') => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-input border-border text-foreground mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Café">Café</SelectItem>
                    <SelectItem value="Pimenta">Pimenta</SelectItem>
                    <SelectItem value="Cacau">Cacau</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Quantidade</label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="bg-input border-border text-foreground mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Preço Unitário (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="bg-input border-border text-foreground mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Estoque Mínimo</label>
                <Input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-input border-border text-foreground mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-border hover:bg-muted"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {editingId ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-card border-border text-foreground flex-1 min-w-[200px]"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-card border-border text-foreground w-[180px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="">Todas as categorias</SelectItem>
            <SelectItem value="Café">Café</SelectItem>
            <SelectItem value="Pimenta">Pimenta</SelectItem>
            <SelectItem value="Cacau">Cacau</SelectItem>
            <SelectItem value="Outros">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>{filteredProducts.length} produtos encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-accent">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Categoria</th>
                  <th className="text-right py-3 px-4 font-semibold text-accent">Quantidade</th>
                  <th className="text-right py-3 px-4 font-semibold text-accent">Preço Unit.</th>
                  <th className="text-right py-3 px-4 font-semibold text-accent">Valor Total</th>
                  <th className="text-right py-3 px-4 font-semibold text-accent">Min. Estoque</th>
                  <th className="text-center py-3 px-4 font-semibold text-accent">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground">{product.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                    <td className={`py-3 px-4 text-right font-medium ${product.quantity < product.minStock ? 'text-red-500' : 'text-green-500'}`}>
                      {product.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">R$ {product.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-accent font-semibold">
                      R$ {(product.quantity * product.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{product.minStock}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(product)}
                          className="hover:bg-muted"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(product.id)}
                          className="hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
