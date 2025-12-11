import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import Header from "./components/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "WartMart Angolano",
    description: "Marketplace Angolano",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProviderWrapper>
            <Header />
            {children}
        </SessionProviderWrapper>
        </body>
        </html>
    );
}