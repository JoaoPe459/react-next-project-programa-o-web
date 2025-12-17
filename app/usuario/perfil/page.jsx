'use client';

import {useEffect, useState} from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { UserCog, Save, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { API_BASE_URL } from "@/app/utils/api-config";

export default function PerfilPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_USUARIO") {
            router.push("/"); // Manda para home se não for usuario
        }
    }, [status, session, router]);

    // Dados para atualização
    const [formData, setFormData] = useState({
        nome: session?.user?.nome || '',
        email: session?.user?.email || '',
        senha: ''
    });


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
        <div className="min-h-screen bg-page-bg dark:bg-slate-900 py-12 px-4 flex justify-center transition-colors duration-200">
            <Toaster position="top-right" />

            <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-slate-700 transition-colors duration-200">

                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="bg-brand-purple/10 dark:bg-purple-900/20 p-3 rounded-full">
                        <UserCog className="w-8 h-8 text-brand-purple dark:text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Meu Perfil</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie suas informações pessoais</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nova Senha (opcional)</label>
                        <input
                            type="password"
                            placeholder="Deixe em branco para manter a atual"
                            value={formData.senha}
                            onChange={(e) => setFormData({...formData, senha: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-opacity-90 flex justify-center items-center gap-2 transition dark:ring-offset-slate-800"
                    >
                        {loading ? <Loader2 className="animate-spin"/> : <Save className="w-5 h-5"/>}
                        Atualizar Dados
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
                    <h3 className="text-red-700 dark:text-red-400 font-bold flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5"/> Zona de Perigo
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">A exclusão da conta é irreversível.</p>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold py-2 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-700 transition flex justify-center items-center gap-2 bg-transparent"
                    >
                        <Trash2 className="w-4 h-4" /> Excluir Minha Conta
                    </button>
                </div>
            </div>
        </div>
    );
}