// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// --- Types ---
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Load from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('woodsphere-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Save to LocalStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('woodsphere-cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // --- Actions ---

  const addToCart = (product: any, quantity: number) => {
    // Logic Step 1: Check existing item to determine Toast message
    const existing = items.find((i) => i.id === product.id);
    
    if (existing) {
       if (existing.quantity + quantity > product.stock) {
         toast.error("Cannot add more than available stock!");
         return;
       }
       toast.success(`Updated quantity for ${product.name}`);
    } else {
       toast.success(`Added ${product.name} to bag`);
    }

    // Logic Step 2: Update State (Pure Logic Only)
    setItems((currentItems) => {
      const existingInState = currentItems.find((i) => i.id === product.id);
      
      if (existingInState) {
        return currentItems.map((i) => 
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      return [...currentItems, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images[0],
        quantity: quantity,
        maxStock: product.stock
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((current) => current.filter((i) => i.id !== id));
    toast.info("Item removed from bag");
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((current) => current.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > item.maxStock) {
          toast.error("Max stock reached");
          return item;
        }
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  // --- Derived State ---
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};