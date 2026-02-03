// ESLint flat config - extends Next.js config for proper JSX/React parsing
// ESLint is disabled during builds in next.config.mjs to avoid circular structure issues
import nextConfig from 'eslint-config-next';

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'public/**', 'out/**'],
  },
  ...nextConfig,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];


