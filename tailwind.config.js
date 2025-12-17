/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'brand-purple': '#7C3AED',
                'header-bg': '#0F172A',
                'page-bg': '#F8FAFC',
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}