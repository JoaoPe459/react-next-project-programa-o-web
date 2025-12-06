'use server'

export async function registerUserAction(data) {
  // 1. Validação Manual no Servidor (Substituindo o Zod)
  const errors = {};
  
  if (!data.nome || data.nome.length < 3) {
    errors.nome = "Nome deve ter pelo menos 3 caracteres.";
  }
  
  // Regex simples para e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email ||!emailRegex.test(data.email)) {
    errors.email = "E-mail inválido.";
  }

  if (!data.senha || data.senha.length < 6) {
    errors.senha = "Senha deve ter no mínimo 6 caracteres.";
  }

  // Se houver erros, retorna imediatamente
  if (Object.keys(errors).length > 0) {
    return { error: "Dados inválidos", validationErrors: errors };
  }

  // 2. Envio para a API Java
  try {
    const response = await fetch('http://localhost:8080/api/users/usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.status === 409) {
      return { error: "Este e-mail já está cadastrado." };
    }

    if (!response.ok) {
      return { error: "Erro ao conectar com o servidor." };
    }

    return { success: true };
  } catch (err) {
    return { error: "Falha na conexão." };
  }
}