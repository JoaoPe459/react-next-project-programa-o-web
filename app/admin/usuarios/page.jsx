'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Users, Trash2, Shield, User, Mail, UserPlus, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from "@/app/utils/api-config";

export default function UsuariosPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_ADMIN") {
            router.push("/");
        } else {
            fetchUsuarios();
        }
    }, [status, session, router]);

    const fetchUsuarios = async () => {
        try {
            // Assume que o backend tem um GET /api/users que lista todos
            const res = await fetch(`${API_BASE_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data);
            } else {
                toast.error("Erro ao carregar lista de usuários.");
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            toast.error("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // Previne que o admin exclua a si mesmo
        if (id === session.user.id) {
            toast.error("Você não pode excluir sua própria conta.");
            return;
        }

        if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });

            if (res.ok) {
                toast.success("Usuário excluído com sucesso!");
                setUsuarios(prev => prev.filter(u => u.id !== id));
            } else {
                toast.error("Erro ao excluir usuário.");
            }
        } catch (error) {
            toast.error("Erro de conexão.");
        }
    };

    // Função auxiliar para formatar o nome do papel (Role)
    const formatRole = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Shield size={12}/> ADMIN</span>;
            case 'ROLE_FORNECEDOR': return <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold w-fit">FORNECEDOR</span>;
            case 'ROLE_USER':
            default: return <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold w-fit">CLIENTE</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page-bg">
                <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
            </div>
        );
    }

    if (session?.user?.role !== "ROLE_ADMIN") return null;

    return (
        <div className="min-h-screen bg-page-bg font-sans p-8">
            <Toaster position="top-right" />
            <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="w-8 h-8 text-brand-purple" />
                        Gerenciar Usuários
                    </h1>
                    {/* Botão opcional se você quiser criar uma página de cadastro manual de admin/usuário */}
                    {/* <Link href="/admin/usuarios/novo" className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition">
                        <UserPlus className="w-5 h-5" />
                        Novo Usuário
                    </Link>
                    */}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {usuarios.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Nenhum usuário encontrado.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">Usuário</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Perfil</th>
                                    <th className="px-6 py-4 text-center">Ações</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                                                    <User size={18} />
                                                </div>
                                                <span className="font-medium text-gray-700">{usuario.nome}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="opacity-50" />
                                                {usuario.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatRole(usuario.role)}
                                        </td>
                                        <td className="px-6 py-4 flex justify-center gap-3">
                                            {/* Exemplo: Admin não pode se deletar */}
                                            {usuario.id !== session.user.id && (
                                                <button
                                                    onClick={() => handleDelete(usuario.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                    title="Excluir Usuário"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
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