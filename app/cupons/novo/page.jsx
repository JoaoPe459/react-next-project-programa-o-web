'use client'; // Necessário se estiveres a usar o Next.js App Router (app directory)

import { useState } from 'react';
import Link from 'next/link'; // Assume que estás a usar Next.js para navegação

export default function CadastroCupom() {
    // Estado para os campos do formulário
    const [formData, setFormData] = useState({
        codigo: '',
        tipoDesconto: '',
        valorDesconto: '',
        ativo: true,
    });

    // Estado para armazenar erros de validação
    const [errors, setErrors] = useState({});

    // Atualiza o estado quando o utilizador digita
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Limpa o erro do campo que está a ser editado (opcional, para melhor UX)
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

        // 1. Validação do Código
        if (!formData.codigo.trim()) {
            newErrors.codigo = 'O código do cupom é obrigatório.';
            isValid = false;
        }

        // 2. Validação do Tipo de Desconto
        if (!formData.tipoDesconto) {
            newErrors.tipoDesconto = 'Por favor, selecione um tipo de desconto.';
            isValid = false;
        }

        // 3. Validação do Valor do Desconto
        const valorValue = parseFloat(formData.valorDesconto);

        if (!formData.valorDesconto) {
            newErrors.valorDesconto = 'O valor do desconto é obrigatório.';
            isValid = false;
        } else if (isNaN(valorValue)) {
            newErrors.valorDesconto = 'Por favor, insira um número válido.';
            isValid = false;
        } else if (valorValue <= 0) {
            newErrors.valorDesconto = 'O valor do desconto deve ser maior que zero.';
            isValid = false;
        } else if (formData.tipoDesconto === 'porcentagem' && valorValue >= 100) {
            newErrors.valorDesconto = 'Desconto em porcentagem deve ser menor que 100.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            console.log('Formulário de cupom válido. Enviando...', formData);

            // Simulação de envio
            alert('Cupom cadastrado com sucesso! (Simulação)');

            // Em Next.js, usarias router.push('/cupons') ou similar
            // window.location.href = '/cupons.html';
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center py-12 px-4 bg-header-bg font-sans">

            {/* Cabeçalho / Logo */}
            <div className="flex items-center space-x-3 mb-8">
                <div className="bg-yellow-400 p-2 rounded-md">
                    <svg
                        className="w-8 h-8 text-header-bg"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                </div>
                <span className="text-3xl font-bold text-black">Walmart Angolano</span>
            </div>

            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Criar Novo Cupom</h2>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-5">

                        {/* Campo Código */}
                        <div>
                            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                                Código do Cupom
                            </label>
                            <input
                                type="text"
                                id="codigo"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                placeholder="Ex: NATAL15 ou FRETEGRATIS"
                                className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors
                  ${errors.codigo
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-brand-purple'
                                }`}
                            />
                            {errors.codigo && (
                                <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Campo Tipo de Desconto */}
                            <div>
                                <label htmlFor="tipo-desconto" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Desconto
                                </label>
                                <select
                                    id="tipo-desconto"
                                    name="tipoDesconto" // Note o camelCase para bater certo com o estado
                                    value={formData.tipoDesconto}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white
                    ${errors.tipoDesconto
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-brand-purple'
                                    }`}
                                >
                                    <option value="" disabled>Selecione o tipo</option>
                                    <option value="porcentagem">Porcentagem (%)</option>
                                    <option value="fixo">Valor Fixo (Kz)</option>
                                </select>
                                {errors.tipoDesconto && (
                                    <p className="text-red-500 text-xs mt-1">{errors.tipoDesconto}</p>
                                )}
                            </div>

                            {/* Campo Valor do Desconto */}
                            <div>
                                <label htmlFor="valor-desconto" className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor do Desconto
                                </label>
                                <input
                                    type="number"
                                    id="valor-desconto"
                                    name="valorDesconto" // Note o camelCase
                                    value={formData.valorDesconto}
                                    onChange={handleChange}
                                    placeholder="Ex: 15 (para 15%) ou 1000"
                                    min="0.01"
                                    step="any"
                                    // Classes do Tailwind para remover spinners e aparência
                                    className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                    ${errors.valorDesconto
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-brand-purple'
                                    }`}
                                />
                                {errors.valorDesconto && (
                                    <p className="text-red-500 text-xs mt-1">{errors.valorDesconto}</p>
                                )}
                            </div>
                        </div>

                        {/* Checkbox Ativo */}
                        <div>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="ativo"
                                    name="ativo"
                                    checked={formData.ativo}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">Marcar como ativo</span>
                            </label>
                        </div>

                        {/* Botão de Submissão */}
                        <button
                            type="submit"
                            className="w-full bg-brand-purple text-black font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200"
                        >
                            Cadastrar Cupom
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    <Link href="/cupons" className="font-medium text-brand-purple hover:underline">
                        Voltar ao Painel de Cupons
                    </Link>
                </p>
            </div>
        </div>
    );
}