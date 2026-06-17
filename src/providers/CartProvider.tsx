import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../shared/types';
import api from '../shared/services/api';
import { useAuth } from './AuthProvider';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem, availableStock: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, delta: number, availableStock: number) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/customercart-api/customer/${user.emailId}/products`);
      const mappedItems = response.data.map((item: any) => ({
        productId: item.product.productId.toString(),
        productName: item.product.name,
        colorName: 'Standard',
        size: 'Default',
        quantity: item.quantity,
        price: item.product.price,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        availableQuantity: item.product.availableQuantity
      }));
      setItems(mappedItems);
    } catch (err) {
      console.error('Failed to fetch cart', err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (newItem: CartItem, availableStock: number) => {
    if (!user) return;
    
    const existingItem = items.find(i => i.productId === newItem.productId);
    if (existingItem) {
        throw new Error('ALREADY_IN_CART');
    }
    
    await api.post('/customercart-api/products', {
      customerEmailId: user.emailId,
      cartProducts: [{ product: { productId: parseInt(newItem.productId) }, quantity: newItem.quantity }]
    });
    await fetchCart();
  };

  const removeItem = async (productId: string) => {
    if (!user) return;
    await api.delete(`/customercart-api/customer/${user.emailId}/product/${productId}`);
    await fetchCart();
  };

  const updateQuantity = async (
    productId: string, 
    delta: number, 
    availableStock: number
) => {
    if (!user) return;
    const item = items.find(i => i.productId === productId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty > availableStock) {
        throw new Error('LIMIT_REACHED');
    }

    const finalQty = Math.max(1, newQty);
    await api.put(
        `/customercart-api/customer/${user.emailId}/product/${productId}`,
        finalQty, 
        { headers: { 'Content-Type': 'application/json' } }
    );
    await fetchCart();
};

  const clearCart = async () => {
    if (!user) return;
    await api.delete(`/customercart-api/customer/${user.emailId}/products`);
    setItems([]);
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};