import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // Retrieve stored cart data on initial load
    const savedCart = localStorage.getItem('digistore_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    // Persist cart state to local storage whenever it changes
    localStorage.setItem('digistore_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Prevent adding duplicate digital items to the cart
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) return prevCart; 
      return [...prevCart, product];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}