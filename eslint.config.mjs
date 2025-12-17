// Minimal ESLint flat config for Next.js 15
// ESLint is disabled during builds in next.config.mjs to avoid circular structure issues
// This config is kept for IDE integration and manual linting
export default [
  {
    ignores: ['node_modules/**', '.next/**', 'public/**', 'out/**'],
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      // Disable img element warning (using next/image is preferred but not always possible)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];


