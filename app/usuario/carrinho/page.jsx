'use client';

import {useEffect, useState} from 'react';
import { useCart } from "@/app/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/utils/api-config";
import { Trash2, Plus, Minus, Tag, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function CarrinhoPage() {
    const { cartItems, removeFromCart, updateItemQuantity, clearCart, cartTotal } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();

    // Estados para o Cupom
    const [codigoCupom, setCodigoCupom] = useState("");
    const [cupomAplicado, setCupomAplicado] = useState(null); // Armazena o objeto do cupom válido
    const [erroCupom, setErroCupom] = useState("");
    const [loadingCupom, setLoadingCupom] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_USUARIO") {
            router.push("/"); // Manda para home se não for usuario
        }
    }, [status, session, router]);

    // Função para verificar e aplicar o cupom
    const verificarCupom = async () => {
        if (!codigoCupom.trim()) return;

        setLoadingCupom(true);
        setErroCupom("");
        setCupomAplicado(null);

        try {
            // Rota ajustada com /api
            const res = await fetch(`${API_BASE_URL}/api/cupons/codigo/${codigoCupom}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token}`
                }
            });

            if (res.ok) {
                const data = await res.json();

                if (data.ativo === false) {
                    setErroCupom("Este cupom não está mais ativo.");
                } else {
                    setCupomAplicado(data);
                }
            } else {
                setErroCupom("Cupom inválido ou não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao validar cupom:", error);
            setErroCupom("Erro ao conectar com o servidor.");
        } finally {
            setLoadingCupom(false);
        }
    };

    // Função auxiliar para remover o cupom aplicado
    const removerCupom = () => {
        setCupomAplicado(null);
        setCodigoCupom("");
        setErroCupom("");
    };

    // --- CORREÇÃO AQUI ---
    // Cálculos de Totais baseados no JSON retornado
    const calcularDesconto = () => {
        if (!cupomAplicado) return 0;

        // O JSON retorna "PERCENTAGEM", não "PERCENTUAL"
        if (cupomAplicado.tipoDesconto === 'PERCENTAGEM') {
            return (cartTotal * cupomAplicado.valorDesconto) / 100;
        }

        if (cupomAplicado.tipoDesconto === 'FIXO') {
            const desconto = cupomAplicado.valorDesconto;
            // Garante que o desconto não seja maior que o total da compra
            return desconto > cartTotal ? cartTotal : desconto;
        }

        return 0;
    };

    const valorDesconto = calcularDesconto();
    const totalFinal = cartTotal - valorDesconto;

    const finalizarCompra = async () => {
        if (cartItems.length === 0) return;

        const pedidoPayload = {
            itens: cartItems.map(item => ({
                produtoId: item.id,
                quantidade: item.quantity
            })),
            codigoCupom: cupomAplicado ? cupomAplicado.codigo : null,
            totalPago: totalFinal
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token}`
                },
                body: JSON.stringify(pedidoPayload)
            });

            if (res.ok) {
                alert("Pedido realizado com sucesso!");
                clearCart();
                router.push("/usuario/pedidos");
            } else {
                alert("Erro ao finalizar pedido.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    if (cartItems.length === 0) return <div className="p-10 text-center text-gray-500">Seu carrinho está vazio.</div>;

    const formatCurrency = (value) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

    return (
        <div className="container mx-auto p-4 min-h-screen bg-page-bg">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Seu Carrinho</h1>
            <div className="bg-white rounded-lg shadow p-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 py-4 gap-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800">{item.nome}</h3>
                            <p className="text-sm text-gray-500">
                                Unitário: {formatCurrency(item.preco)}
                            </p>
                        </div>

                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition"
                            >
                                <Minus size={16} />
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val >= 1) updateItemQuantity(item.id, val);
                                }}
                                className="w-12 text-center border-x border-gray-300 py-1 focus:outline-none text-gray-700 font-medium"
                            />
                            <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 text-gray-600 transition"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-6 min-w-[150px] justify-end">
                            <span className="font-bold text-gray-900">
                                {formatCurrency(item.preco * item.quantity)}
                            </span>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                                title="Remover item"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                <div className="mt-8 flex flex-col md:flex-row gap-8 justify-between items-start">
                    {/* Coluna Esquerda: Cupom */}
                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Cupom de Desconto</label>
                        <div className="flex gap-2">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Código do cupom"
                                    value={codigoCupom}
                                    onChange={(e) => setCodigoCupom(e.target.value)}
                                    disabled={!!cupomAplicado}
                                    className={`pl-10 w-full border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 transition text-gray-700 ${
                                        erroCupom ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-green-500'
                                    } ${cupomAplicado ? 'bg-gray-100' : ''}`}
                                />
                            </div>

                            {!cupomAplicado ? (
                                <button
                                    onClick={verificarCupom}
                                    disabled={loadingCupom || !codigoCupom}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition flex items-center gap-2"
                                >
                                    {loadingCupom ? <Loader2 className="animate-spin" size={18}/> : "Aplicar"}
                                </button>
                            ) : (
                                <button
                                    onClick={removerCupom}
                                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium"
                                >
                                    Remover
                                </button>
                            )}
                        </div>

                        {erroCupom && (
                            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                <XCircle size={14} /> {erroCupom}
                            </p>
                        )}
                        {cupomAplicado && (
                            <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                                <CheckCircle size={14} /> Cupom &#34;{cupomAplicado.codigo}&#34; aplicado!
                            </p>
                        )}
                    </div>

                    {/* Coluna Direita: Resumo Financeiro */}
                    <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>

                            {/* --- CORREÇÃO VISUAL AQUI --- */}
                            {cupomAplicado && (
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>
                                        Desconto ({cupomAplicado.tipoDesconto === 'PERCENTAGEM'
                                        ? `${cupomAplicado.valorDesconto}%`
                                        : 'Valor Fixo'})
                                    </span>
                                    <span>- {formatCurrency(valorDesconto)}</span>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between text-xl font-bold text-gray-800">
                                    <span>Total</span>
                                    <span>{formatCurrency(totalFinal)}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={finalizarCompra}
                            className="w-full mt-6 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-lg shadow-green-200"
                        >
                            Finalizar Compra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}