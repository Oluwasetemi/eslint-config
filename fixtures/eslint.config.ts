import { setemiojo } from './src'

export default setemiojo(
  {
    vue: {
      a11y: true,
    },
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    typescript: true,
    formatters: true,
    pnpm: true,
    type: 'lib',
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
