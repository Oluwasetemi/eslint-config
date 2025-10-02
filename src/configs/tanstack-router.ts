import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { ensurePackages, interopDefault } from '../utils'

export async function tanstackRouter(
  options: OptionsFiles & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = ['**/*.{js,jsx,ts,tsx}'],
    overrides = {},
  } = options

  await ensurePackages([
    '@tanstack/eslint-plugin-router',
  ])

  const [pluginRouter] = await Promise.all([
    interopDefault(import('@tanstack/eslint-plugin-router')),
  ] as const)

  return [
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
        // TanStack Router recommended rules
        '@tanstack/router/create-route-property-order': 'error',

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

        // overrides
        ...overrides,
      },
    },
  ]
}
