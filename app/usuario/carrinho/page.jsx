'use client';

import { useCart } from "@/app/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/utils/api-config";
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CarrinhoPage() {
    const { cartItems, removeFromCart, updateItemQuantity, clearCart, cartTotal } = useCart();
    const { data: session } = useSession();
    const router = useRouter();

    const finalizarCompra = async () => {
        if (cartItems.length === 0) return;

        const pedidoPayload = {
            itens: cartItems.map(item => ({
                produtoId: item.id,
                quantidade: item.quantity
            })),
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

    return (
        <div className="container mx-auto p-4 min-h-screen bg-page-bg">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Seu Carrinho</h1>
            <div className="bg-white rounded-lg shadow p-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 py-4 gap-4">

                        {/* Informações do Produto */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800">{item.nome}</h3>
                            <p className="text-sm text-gray-500">
                                Unitário: {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(item.preco)}
                            </p>
                        </div>

                        {/* Controle de Quantidade */}
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
                                    if (!isNaN(val) && val >= 1) {
                                        updateItemQuantity(item.id, val);
                                    }
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

                        {/* Subtotal e Remover */}
                        <div className="flex items-center gap-6 min-w-[150px] justify-end">
                            <span className="font-bold text-gray-900">
                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(item.preco * item.quantity)}
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

                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-2xl font-bold text-gray-800">
                        Total: {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(cartTotal)}
                    </div>
                    <button
                        onClick={finalizarCompra}
                        className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-lg shadow-green-200"
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    );
}