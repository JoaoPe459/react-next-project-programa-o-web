'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Ticket, Plus, Trash2, Edit, CalendarOff } from 'lucide-react';

export default function CuponsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [cupons, setCupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;

        // --- ALTERADO: Verificação agora é para ROLE_ADMIN ---
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_ADMIN") {
            router.push("/"); // Manda para home se não for admin
            return;
        }
        fetchCupons();
    }, [status, session]);

    const fetchCupons = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/cupons', {
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCupons(data);
            }
        } catch (error) {
            console.error("Erro ao buscar cupons:", error);
            toast.error("Erro ao carregar cupons.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este cupom?")) return;

        try {
            const res = await fetch(`http://localhost:8080/api/cupons/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });

            if (res.ok) {
                toast.success("Cupom excluído com sucesso!");
                setCupons(prev => prev.filter(c => c.id !== id));
            } else {
                toast.error("Erro ao excluir cupom.");
            }
        } catch (error) {
            toast.error("Erro de conexão.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page-bg">
                <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
            </div>
        );
    }

    // Se não for admin, não renderiza nada enquanto redireciona
    if (session?.user?.role !== "ROLE_ADMIN") return null;

    return (
        <div className="min-h-screen bg-page-bg font-sans p-8">
            <Toaster position="top-right" />
            <div className="container mx-auto max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Ticket className="w-8 h-8 text-brand-purple" />
                        Gerenciar Cupons
                    </h1>
                    <Link href="/cupons/novo" className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition">
                        <Plus className="w-5 h-5" />
                        Novo Cupom
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {cupons.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <CalendarOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Nenhum cupom cadastrado.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">Código</th>
                                    <th className="px-6 py-4">Desconto</th>
                                    <th className="px-6 py-4">Validade</th>
                                    <th className="px-6 py-4 text-center">Ações</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {cupons.map((cupom) => (
                                    <tr key={cupom.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono font-bold text-brand-purple">
                                            {cupom.codigo}
                                        </td>
                                        <td className="px-6 py-4">
                                            {cupom.tipoDesconto === 'PERCENTAGEM'
                                                ? `${cupom.valorDesconto}%`
                                                : `Kz ${cupom.valorDesconto}`}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {cupom.dataValidade || "Sem validade"}
                                        </td>
                                        <td className="px-6 py-4 flex justify-center gap-3">
                                            <Link href={`/cupons/${cupom.id}/editar`} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50">
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(cupom.id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}