/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],

  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Be Vietnam Pro',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
      },

      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',

        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',

        success: 'var(--color-success)',
        info: 'var(--color-info)',
        danger: 'var(--color-danger)',
      },
    },
  },

  plugins: [],
};
