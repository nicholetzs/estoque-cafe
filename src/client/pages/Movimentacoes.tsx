import { useState } from 'react';

import { Plus, ArrowUp, ArrowDown } from 'lucide-react';

import { toast } from 'sonner';
import { useInventoryStore } from '../lib/store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Movimentacoes() {
  const { products, movements, addMovement } = useInventoryStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'entrada' as const,
    quantity: 0,
    notes: '',
  });

  const handleSave = () => {
    if (!formData.productId) {
      toast.error('Selecione um produto');
      return;
    }

    if (formData.quantity <= 0) {
      toast.error('Quantidade deve ser maior que 0');
      return;
    }

    addMovement({
      ...formData,
      date: new Date().toISOString(),
    });

    toast.success(`Movimentação registrada com sucesso`);
    setFormData({
      productId: '',
      type: 'entrada',
      quantity: 0,
      notes: '',
    });
    setOpen(false);
  };

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || 'Produto desconhecido';
  };

  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-accent mb-2">Movimentações</h1>
          <p className="text-muted-foreground">Registre entradas e saídas de produtos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nova Movimentação
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-accent">Registrar Movimentação</DialogTitle>
              <DialogDescription>
                Registre uma entrada ou saída de produto do seu estoque
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-foreground">Produto</label>
                <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                  <SelectTrigger className="bg-input border-border text-foreground mt-1">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Tipo de Movimentação</label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-input border-border text-foreground mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="entrada">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="w-4 h-4 text-green-500" />
                        Entrada
                      </div>
                    </SelectItem>
                    <SelectItem value="saida">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="w-4 h-4 text-red-500" />
                        Saída
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                <label className="text-sm font-medium text-foreground">Observações</label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Compra fornecedor, Venda cliente..."
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
                Registrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Movements Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
          <CardDescription>{movements.length} movimentações registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-accent">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Produto</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Tipo</th>
                  <th className="text-right py-3 px-4 font-semibold text-accent">Quantidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Observações</th>
                </tr>
              </thead>
              <tbody>
                {sortedMovements.map((movement) => (
                  <tr key={movement.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground">
                      {new Date(movement.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {getProductName(movement.productId)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {movement.type === 'entrada' ? (
                          <>
                            <ArrowDown className="w-4 h-4 text-green-500" />
                            <span className="text-green-500 font-medium">Entrada</span>
                          </>
                        ) : (
                          <>
                            <ArrowUp className="w-4 h-4 text-red-500" />
                            <span className="text-red-500 font-medium">Saída</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      movement.type === 'entrada' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{movement.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedMovements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma movimentação registrada
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
