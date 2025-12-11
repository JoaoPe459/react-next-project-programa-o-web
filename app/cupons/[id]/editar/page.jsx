'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditarCupom() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        codigo: '',
        tipoDesconto: '',
        valorDesconto: '',
        dataValidade: ''
    });

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ROLE_ADMIN") {
            fetchCupom();
        } else if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, id]);

    const fetchCupom = async () => {
        try {
            // Nota: Postman sugere buscar em /api/cupons
            const res = await fetch(`http://localhost:8080/api/cupons`, {
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const cupom = data.find(c => c.id.toString() === id);
                if (cupom) {
                    setFormData({
                        codigo: cupom.codigo,
                        tipoDesconto: cupom.tipoDesconto,
                        valorDesconto: cupom.valorDesconto,
                        dataValidade: cupom.dataValidade || ''
                    });
                } else {
                    toast.error("Cupom não encontrado.");
                    router.push("/cupons");
                }
            }
        } catch (error) {
            toast.error("Erro ao carregar dados.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/cupons/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Cupom atualizado!");
                setTimeout(() => router.push("/cupons"), 1500);
            } else {
                toast.error("Erro ao atualizar.");
            }
        } catch (error) {
            toast.error("Erro de conexão.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-page-bg flex items-center justify-center p-4">
            <Toaster position="top-right" />
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Editar Cupom</h2>
                    <Link href="/cupons" className="text-gray-500 hover:text-brand-purple"><ArrowLeft className="w-6 h-6"/></Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Código</label>
                        <input
                            type="text"
                            value={formData.codigo}
                            onChange={e => setFormData({...formData, codigo: e.target.value})}
                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-purple outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo Desconto</label>
                        <select
                            value={formData.tipoDesconto}
                            onChange={e => setFormData({...formData, tipoDesconto: e.target.value})}
                            className="w-full border rounded-lg p-2.5 outline-none"
                        >
                            <option value="PERCENTAGEM">Porcentagem</option>
                            <option value="FIXO">Valor Fixo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Valor</label>
                        <input
                            type="number"
                            value={formData.valorDesconto}
                            onChange={e => setFormData({...formData, valorDesconto: e.target.value})}
                            className="w-full border rounded-lg p-2.5 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Validade</label>
                        <input
                            type="date"
                            value={formData.dataValidade}
                            onChange={e => setFormData({...formData, dataValidade: e.target.value})}
                            className="w-full border rounded-lg p-2.5 outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full bg-brand-purple text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-opacity-90">
                        <Save className="w-5 h-5" /> Salvar Alterações
                    </button>
                </form>
            </div>
        </div>
    );
}