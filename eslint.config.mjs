import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['build/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  { files: ['**/*.{ts,mjs}'], rules: { 'no-debugger': 'error', 'no-eval': 'error', 'no-constant-condition': 'error' } },
);
