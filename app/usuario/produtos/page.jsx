'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from "@/app/utils/api-config";
import ProductList from "@/app/components/ProductList";
import {useCart} from "@/app/context/CartContext";

export default function ProdutosPageUsuario() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [produtos, setProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_USUARIO") {
            router.push("/"); // Manda para home se não for usuario
        }
        fetchProdutos()
    }, [status, session, router]);

    const fetchProdutos = async () => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (session?.user?.token) headers['Authorization'] = `Bearer ${session.user.token}`;

            const res = await fetch(`${API_BASE_URL}/api/produtos`, { headers });
            if (res.ok) {
                setProdutos(await res.json());
            } else {
                setProdutos([]);
            }
        } catch (error) {
            console.error("Erro conexão", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (produto) => {
        addToCart(produto);
        alert(`${produto.nome} adicionado ao carrinho!`);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-page-bg py-8 px-4 container mx-auto">
            <ProductList
                produtos={produtos}
                loading={loading}
                isFornecedor={false}
                onAddToCart={handleAddToCart} // Passa a nova função
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
        </div>
    );
}