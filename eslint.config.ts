import { setemiojo } from './src'

export default setemiojo(
  {
    vue: {
      a11y: true,
    },
    react: true,
    tanstackRouter: true,
    solid: true,
    svelte: true,
    astro: true,
    nextjs: true,
    typescript: true,
    formatters: true,
    pnpm: true,
    type: 'lib',
    jsx: {
      a11y: true,
    },
  },
  {
    ignores: [
      'fixtures',
      '_fixtures',
      '**/constants-generated.ts',
    ],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
)
