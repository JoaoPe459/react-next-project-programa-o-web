'use client'

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "../context/CartContext"
import { ThemeProvider } from "next-themes"

export default function SessionProviderWrapper({ children }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <CartProvider>
                    {children}
                </CartProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}