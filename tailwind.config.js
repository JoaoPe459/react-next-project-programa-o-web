/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {colors: {
        'brand-purple': '#6d28d9', // Exemplo de roxo (ajuste se souber o hex exato)
        'header-bg': '#f3f4f6',     // Exemplo de fundo (cinza claro)
      },
    },
  },
  plugins: [],
}