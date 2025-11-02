import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  category: 'Café' | 'Pimenta' | 'Cacau' | 'Outros';
  quantity: number;
  unitPrice: number;
  minStock: number;
  createdAt: string;
}

export interface Movement {
  id: string;
  productId: string;
  type: 'entrada' | 'saida';
  quantity: number;
  date: string;
  notes: string;
}

interface InventoryStore {
  products: Product[];
  movements: Movement[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addMovement: (movement: Omit<Movement, 'id'>) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Café Arábica Premium',
    category: 'Café',
    quantity: 150,
    unitPrice: 25.50,
    minStock: 20,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Café Robusta',
    category: 'Café',
    quantity: 200,
    unitPrice: 18.00,
    minStock: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pimenta Preta em Grão',
    category: 'Pimenta',
    quantity: 75,
    unitPrice: 12.50,
    minStock: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Pimenta Vermelha',
    category: 'Pimenta',
    quantity: 45,
    unitPrice: 15.00,
    minStock: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Cacau em Pó Premium',
    category: 'Cacau',
    quantity: 120,
    unitPrice: 32.00,
    minStock: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Cacau em Grão',
    category: 'Cacau',
    quantity: 85,
    unitPrice: 28.50,
    minStock: 12,
    createdAt: new Date().toISOString(),
  },
];

const initialMovements: Movement[] = [
  {
    id: '1',
    productId: '1',
    type: 'entrada',
    quantity: 50,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Compra fornecedor A',
  },
  {
    id: '2',
    productId: '2',
    type: 'saida',
    quantity: 30,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Venda cliente B',
  },
];

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      movements: initialMovements,

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          movements: state.movements.filter((m) => m.productId !== id),
        })),

      addMovement: (movement) =>
        set((state) => {
          const product = state.products.find((p) => p.id === movement.productId);
          if (!product) return state;

          const newQuantity =
            movement.type === 'entrada'
              ? product.quantity + movement.quantity
              : product.quantity - movement.quantity;

          return {
            products: state.products.map((p) =>
              p.id === movement.productId
                ? { ...p, quantity: Math.max(0, newQuantity) }
                : p
            ),
            movements: [
              ...state.movements,
              {
                ...movement,
                id: Date.now().toString(),
              },
            ],
          };
        }),

      getProductById: (id) => get().products.find((p) => p.id === id),

      getProductsByCategory: (category) =>
        get().products.filter((p) => p.category === category),
    }),
    {
      name: 'inventory-store',
    }
  )
);
