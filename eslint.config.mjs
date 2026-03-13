import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';

export default defineConfig([
  // Next.js official rules
  ...nextVitals,

  // Ignore build outputs
  globalIgnores(['.next/**', 'out/**', 'build/**', 'dist/**', 'next-env.d.ts']),

  // JS / JSX (client + server)
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      // tailwindcss: tailwind,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      // 'tailwindcss/no-arbitrary-value': 'error',
      'react/jsx-no-literals': 'off',
      // CHẶN HARD-CODE TEXT
      // 'react/jsx-no-literals': [
      //   'error', 
      //   { 
      //     "noStrings": true, 
      //     "allowedStrings": ["core-web-vitals"] // Những từ đặc biệt được phép
      //   }
      // ],
    },
  },
]);
