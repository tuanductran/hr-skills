// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  markdown: false,
  ignores: [
    'skills/**',
    '**/dist/**',
    '**/node_modules/**',
  ],
})
  .override('antfu/javascript/rules', {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': ['error', { destructuring: 'any' }],
    },
  })
  .override('antfu/typescript/rules', {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  })
