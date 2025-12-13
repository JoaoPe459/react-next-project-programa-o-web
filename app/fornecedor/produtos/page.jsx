'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from "@/app/utils/api-config";
import ProductList from "@/app/components/ProductList";
import {router} from "next/client";
import {useRouter} from "next/navigation";

export default function ProdutosPageFornecedor() {
    const { data: session, status } = useSession();
    const [produtos, setProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_FORNECEDOR") {
            router.push("/"); // Manda para home se não for fornecedor
        }
        fetchProdutos();
    }, [status, session, router]);

    const fetchProdutos = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/produtos/produtos-vendedor`, {
                headers: { 'Authorization': `Bearer ${session?.user?.token}` }
            });
            if (res.ok) setProdutos(await res.json());
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Excluir este produto?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            if (res.ok) setProdutos((prev) => prev.filter((p) => p.id !== id));
            else alert("Erro ao excluir.");
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-page-bg py-8 px-4 container mx-auto">
            <ProductList
                produtos={produtos}
                loading={loading}
                isFornecedor={true}
                onDelete={handleDelete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
        </div>
    );
}