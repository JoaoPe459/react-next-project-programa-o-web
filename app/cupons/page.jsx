'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast, { Toaster } from 'react-hot-toast';

export default function CadastroCupom() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        codigo: '',
        tipoDesconto: '',
        valorDesconto: '',
        ativo: true,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.codigo.trim()) {
            newErrors.codigo = 'O código do cupom é obrigatório.';
            isValid = false;
        }
        if (!formData.tipoDesconto) {
            newErrors.tipoDesconto = 'Por favor, selecione um tipo de desconto.';
            isValid = false;
        }
        const valorValue = parseFloat(formData.valorDesconto);
        if (!formData.valorDesconto) {
            newErrors.valorDesconto = 'O valor do desconto é obrigatório.';
            isValid = false;
        } else if (isNaN(valorValue) || valorValue <= 0) {
            newErrors.valorDesconto = 'Valor deve ser positivo.';
            isValid = false;
        } else if (formData.tipoDesconto === 'porcentagem' && valorValue >= 100) {
            newErrors.valorDesconto = 'Porcentagem deve ser menor que 100.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const res = await fetch('http://localhost:8080/api/cupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Cupom criado com sucesso!');
                setTimeout(() => router.push('/cupons'), 1500);
            } else {
                toast.error('Erro ao criar cupom. Verifique os dados.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Falha na conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center py-12 px-4 bg-header-bg font-sans">
            <Toaster position="top-right" />
            <div className="flex items-center space-x-3 mb-8">
                <span className="text-3xl font-bold text-white">WoMart Admin</span>
            </div>

            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Criar Novo Cupom</h2>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                            <input
                                type="text"
                                id="codigo"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.codigo ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-purple'}`}
                            />
                            {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="tipo-desconto" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    id="tipo-desconto"
                                    name="tipoDesconto"
                                    value={formData.tipoDesconto}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                >
                                    <option value="" disabled>Selecione...</option>
                                    <option value="porcentagem">Porcentagem (%)</option>
                                    <option value="fixo">Valor Fixo (Kz)</option>
                                </select>
                                {errors.tipoDesconto && <p className="text-red-500 text-xs mt-1">{errors.tipoDesconto}</p>}
                            </div>

                            <div>
                                <label htmlFor="valor-desconto" className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                                <input
                                    type="number"
                                    id="valor-desconto"
                                    name="valorDesconto"
                                    value={formData.valorDesconto}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                />
                                {errors.valorDesconto && <p className="text-red-500 text-xs mt-1">{errors.valorDesconto}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="ativo"
                                    checked={formData.ativo}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">Ativo</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-purple text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-opacity-90 transition-all disabled:opacity-70"
                        >
                            {loading ? 'Salvando...' : 'Cadastrar Cupom'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    <Link href="/cupons" className="font-medium text-brand-purple hover:underline">Voltar</Link>
                </p>
            </div>
        </div>
    );
}