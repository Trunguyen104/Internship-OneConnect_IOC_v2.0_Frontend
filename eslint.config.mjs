import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';

export default defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'dist/**', 'next-env.d.ts', 'node_modules/**']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      prettier,
      react,
    },
    rules: {
      'prettier/prettier': 'warn', // Chuyển sang warn để không làm đỏ lòm cả màn hình khi đang code
      
      // TẮT QUY TẮC NÀY ĐỂ HẾT 2000 LỖI
      'react/jsx-no-literals': 'off', 
      
      // Các quy tắc bổ sung để code "dễ thở" hơn trong lúc OJT
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn'
    },
  },
]);