import type { TypedFlatConfigItem } from '../types'

import { GLOB_SRC, GLOB_SRC_EXT } from '../globs'

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: 'setemiojo/disables/scripts',
      rules: {
        'no-console': 'off',
        'setemiojo/no-top-level-await': 'off',
        'ts/explicit-function-return-type': 'off',
      },
    },
    {
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      name: 'setemiojo/disables/cli',
      rules: {
        'no-console': 'off',
        'setemiojo/no-top-level-await': 'off',
      },
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      name: 'setemiojo/disables/bin',
      rules: {
        'setemiojo/no-import-dist': 'off',
        'setemiojo/no-import-node-modules-by-path': 'off',
      },
    },
    {
      files: ['**/*.d.?([cm])ts'],
      name: 'setemiojo/disables/dts',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'setemiojo/disables/cjs',
      rules: {
        'ts/no-require-imports': 'off',
      },
    },
    {
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      name: 'setemiojo/disables/config-files',
      rules: {
        'no-console': 'off',
        'setemiojo/no-top-level-await': 'off',
        'ts/explicit-function-return-type': 'off',
      },
    },
  ]
}
