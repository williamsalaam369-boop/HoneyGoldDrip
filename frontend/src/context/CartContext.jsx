import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, priceFor } from "@/data/archives";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hg-cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("hg-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (productId, size, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === productId && i.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { productId, size, qty }];
    });
  };

  const removeItem = (productId, size) =>
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));

  const setQty = (productId, size, qty) =>
    setItems((prev) =>
      qty < 1
        ? prev.filter((i) => !(i.productId === productId && i.size === size))
        : prev.map((i) => (i.productId === productId && i.size === size ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);

  const { count, total } = useMemo(() => {
    let c = 0;
    let t = 0;
    for (const i of items) {
      const p = getProduct(i.productId);
      if (!p) continue;
      c += i.qty;
      t += priceFor(p, i.size) * i.qty;
    }
    return { count: c, total: t };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQty, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
};
