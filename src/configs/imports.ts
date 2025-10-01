import type { OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'
import { pluginAntfu, pluginImportLite } from '../plugins'

export async function imports(options: OptionsOverrides & OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
  } = options

  return [
    {
      name: 'setemiojo/imports/rules',
      plugins: {
        import: pluginImportLite,
        setemiojo: pluginAntfu,
      },
      rules: {
        'import/consistent-type-specifier-style': ['error', 'top-level'],
        'import/first': 'error',
        'import/no-duplicates': 'error',

        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'setemiojo/import-dedupe': 'error',
        'setemiojo/no-import-dist': 'error',
        'setemiojo/no-import-node-modules-by-path': 'error',

        ...stylistic
          ? {
              'import/newline-after-import': ['error', { count: 1 }],
            }
          : {},

        ...overrides,
      },
    },
  ]
}
