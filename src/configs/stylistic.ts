import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types'
import { pluginAntfu } from '../plugins'
import { interopDefault } from '../utils'

export const StylisticConfigDefaults: StylisticConfig = {
  braceStyle: 'stroustrup',
  experimental: false,
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false,
}

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    braceStyle,
    experimental,
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    braceStyle,
    experimental,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  }) as TypedFlatConfigItem

  return [
    {
      name: 'setemiojo/stylistic/rules',
      plugins: {
        setemiojo: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        ...experimental
          ? {}
          : {
              'setemiojo/consistent-list-newline': 'error',
            },

        'setemiojo/consistent-chaining': 'error',

        ...(lessOpinionated
          ? {
              curly: ['error', 'all'],
            }
          : {
              'setemiojo/curly': 'error',
              'setemiojo/if-newline': 'error',
              'setemiojo/top-level-function': 'error',
            }
        ),

        'style/generator-star-spacing': ['error', { after: true, before: false }],
        'style/yield-star-spacing': ['error', { after: true, before: false }],

        ...overrides,
      },
    },
  ]
}
