'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('womart_cart');
        if (savedCart) setCartItems(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('womart_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const itemExists = prevItems.find((item) => item.id === product.id);
            if (itemExists) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    // --- NOVA FUNÇÃO: Atualizar quantidade direta ---
    const updateItemQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return; // Não permite zero ou negativo

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((total, item) => total + (item.preco * item.quantity), 0);

    return (
        // Não esqueça de passar o updateItemQuantity aqui no value
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateItemQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);