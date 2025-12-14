'use client'

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "../context/CartContext"

export default function SessionProviderWrapper({ children }) {
    return (
        <SessionProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </SessionProvider>
    )
}