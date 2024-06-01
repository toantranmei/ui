import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  rules: {
    'node/prefer-global/process': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      registeredComponentsOnly: false,
      ignores: [],
    }],
    'vue/no-template-shadow': 'off',
    'style/max-statements-per-line': 'off',
  },
  ignores: [
    'node_modules',
    'dist',
    '.nuxt',
    '.output',
    'coverage',
    'components.d.ts',
    'nuxt.d.ts',
    '.husky',
    '.vscode/global.code-snippets',
    'test',
    'playground',
  ],
})
