import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('uiu_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isCartVisible, setIsCartVisible] = useState(false);

  const getItemId = (item) => (item ? item._id || item.id : null);

  const addToCart = (item) => {
    const targetId = getItemId(item);
    if (!targetId) return;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => getItemId(cartItem) === targetId
      );

      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
      } else {
        updatedCart = [...prevCart, { ...item, id: targetId, _id: targetId, quantity: 1 }];
      }
      try {
        localStorage.setItem('uiu_cart_items', JSON.stringify(updatedCart));
      } catch (e) {}
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const updated = prevCart.filter((item) => getItemId(item) !== itemId);
      try {
        localStorage.setItem('uiu_cart_items', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) => {
      const updated = prevCart.map((item) =>
        getItemId(item) === itemId ? { ...item, quantity: newQuantity } : item
      );
      try {
        localStorage.setItem('uiu_cart_items', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('uiu_cart_items');
    } catch (e) {}
  };


  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartItemCount,
      isCartVisible,
      setIsCartVisible
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
