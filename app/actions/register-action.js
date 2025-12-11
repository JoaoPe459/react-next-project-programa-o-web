'use server'

import {API_BASE_URL} from "@/app/utils/api-config";

export async function registerAction(data) {
  // Define o endpoint baseado na escolha do usuário
  // Se for fornecedor -> /fornecedor, caso contrário -> /usuario
  const endpoint = data.role === 'ROLE_FORNECEDOR' 
   ? '/fornecedor' 
    : '/usuario';

  const apiUrl = `${API_BASE_URL}/api/users${endpoint}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: data.nome,
        email: data.email,
        senha: data.senha
        // A API Java provavelmente define a Role internamente baseada no endpoint,
        // mas enviamos aqui caso o DTO precise.
      }),
    });

    if (response.status === 409) {
      return { error: "Este e-mail já está em uso." };
    }

    if (!response.ok) {
      return { error: "Erro ao processar o cadastro." };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Falha na conexão com o servidor." };
  }
}