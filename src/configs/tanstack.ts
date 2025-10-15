import type { OptionsFiles, OptionsOverrides, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '../types'

import { GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs'
import { ensurePackages, interopDefault } from '../utils'

export async function tanstackRouter(
  options: OptionsTypeScriptParserOptions & OptionsTypeScriptWithTypes & OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [],
    overrides = {},
    tsconfigPath,
  } = options

  await ensurePackages([
    '@tanstack/eslint-plugin-router',
  ])

  const isTypeAware = !!tsconfigPath

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    // Handle conflicts with @typescript-eslint/only-throw-error
    // Allow throwing Redirect from @tanstack/router-core
    'ts/only-throw-error': [
      'error',
      {
        allow: [
          {
            from: 'package',
            name: 'Redirect',
            package: '@tanstack/router-core',
          },
        ],
      },
    ],
  }

  const [pluginRouter] = await Promise.all([
    interopDefault(import('@tanstack/eslint-plugin-router')),
  ] as const)

  return [
    ...pluginRouter.configs['flat/recommended'],
    {
      name: 'setemiojo/tanstack-router/setup',
      plugins: {
        '@tanstack/router': pluginRouter,
      },
    },
    {
      files,
      name: 'setemiojo/tanstack-router/rules',
      rules: {
        // overrides
        ...overrides,
      },
    },
    ...isTypeAware
      ? [{
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: 'setemiojo/tanstack-router/type-aware-rules',
          rules: {
            ...typeAwareRules,
          },
        }]
      : [],
  ]
}
