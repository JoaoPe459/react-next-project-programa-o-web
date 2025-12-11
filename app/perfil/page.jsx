'use client';

import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { UserCog, Save, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import {API_BASE_URL} from "@/app/utils/api-config";

export default function PerfilPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Dados para atualização
    const [formData, setFormData] = useState({
        nome: session?.user?.nome || '',
        email: session?.user?.email || '',
        senha: ''
    });

    if (status === "loading") return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-purple"/></div>;
    if (status === "unauthenticated") { router.push("/login"); return null; }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/users`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Perfil atualizado! Faça login novamente.");
                setTimeout(() => signOut(), 2000);
            } else {
                toast.error("Erro ao atualizar perfil.");
            }
        } catch (error) {
            toast.error("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("ATENÇÃO: Isso excluirá sua conta permanentemente. Tem certeza?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/users`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });

            if (res.ok) {
                toast.success("Conta excluída.");
                signOut({ callbackUrl: '/register' });
            } else {
                toast.error("Erro ao excluir conta.");
            }
        } catch (error) {
            toast.error("Erro de conexão.");
        }
    };

    return (
        <div className="min-h-screen bg-page-bg py-12 px-4 flex justify-center">
            <Toaster position="top-right" />
            <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-gray-100">

                <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                    <div className="bg-brand-purple/10 p-3 rounded-full">
                        <UserCog className="w-8 h-8 text-brand-purple" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
                        <p className="text-sm text-gray-500">Gerencie suas informações pessoais</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-purple outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-purple outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nova Senha (opcional)</label>
                        <input
                            type="password"
                            placeholder="Deixe em branco para manter a atual"
                            value={formData.senha}
                            onChange={(e) => setFormData({...formData, senha: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-purple outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-opacity-90 flex justify-center items-center gap-2 transition"
                    >
                        {loading ? <Loader2 className="animate-spin"/> : <Save className="w-5 h-5"/>}
                        Atualizar Dados
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-red-100 bg-red-50 rounded-lg p-4">
                    <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5"/> Zona de Perigo
                    </h3>
                    <p className="text-sm text-red-600 mb-4">A exclusão da conta é irreversível.</p>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full border border-red-300 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-600 hover:text-white transition flex justify-center items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> Excluir Minha Conta
                    </button>
                </div>
            </div>
        </div>
    );
}