import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const loadCart = async () => {
    if (!user) { setItems([]); return; }
    try { const data = await api.getCart(); setItems(data); } catch {}
  };

  useEffect(() => { loadCart(); }, [user]);

  const addItem = async (productId, quantity = 1) => {
    await api.addToCart({ productId, quantity });
    await loadCart();
    setCartOpen(true);
  };

  const removeItem = async (id) => {
    await api.removeFromCart(id);
    await loadCart();
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return removeItem(id);
    await api.updateCart(id, qty);
    await loadCart();
  };

  const total = items.reduce((s, i) => s + i.quantity * (i.product?.discountPrice || i.product?.price || 0), 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, addItem, removeItem, updateQty, cartOpen, setCartOpen, loadCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
