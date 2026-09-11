# @setemiojo/eslint-config

[![npm](https://img.shields.io/npm/v/@setemiojo/eslint-config?color=444&label=)](https://npmjs.com/package/@setemiojo/eslint-config)

> Based on [@antfu/eslint-config](https://github.com/antfu/eslint-config). This fork tracks upstream while preserving its own package namespace and TanStack Router integration.

- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Reasonable defaults, best practices, only one line of config
- Designed to work with TypeScript, JSX, Vue, JSON, YAML, TOML, Markdown, etc. out of the box
- Opinionated, but [very customizable](#customization)
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Optional [React](#react) (with auto-detection for TanStack Router, React Router v7, and Remix), [TanStack Router](#tanstack-router), [Next.js](#nextjs), [Svelte](#svelte), [UnoCSS](#unocss), [Astro](#astro), and [Solid](#solid) support
- Optional [formatters](#formatters) support for formatting CSS, HTML, XML, etc.
- **Style principle**: Minimal for reading, stable for diff, consistent
  - Sorted imports, dangling commas
  - Single quotes, no semi
  - Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Respects `.gitignore` by default
- Requires ESLint v9.10.0+

> [!WARNING]
> This is a **personal, opinionated config**. Changes might not work for every project, so review the changes whenever you update. If you need complete control over the rules, consider maintaining your own fork.

> [!TIP]
> For more about the tooling and philosophy behind the upstream config, see Anthony Fu's talk [JSNation 2024 - ESLint One for All Made Easy](https://gitnation.com/contents/eslint-one-for-all-made-easy) and the accompanying [slides](https://talks.antfu.me/2024/jsnation).

## Usage

### Starter Wizard

This package provides a CLI tool to help you set up your project or migrate from a legacy config to the new flat config with one command.

```bash
pnpm dlx @setemiojo/eslint-config@latest
```

### Manual Install

If you prefer to set up manually:

```bash
pnpm i -D eslint @setemiojo/eslint-config
```

And create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo()
```

<details>
<summary>
Combined with legacy config:
</summary>

If you still use some configs from the legacy eslintrc format, you can use the [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) package to convert them to the flat config.

```js
// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc'
import setemiojo from '@setemiojo/eslint-config'

const compat = new FlatCompat()

export default setemiojo(
  {
    ignores: [],
  },

  // Legacy config
  ...compat.config({
    extends: [
      'eslint:recommended',
      // Other extends...
    ],
  }),

  // Other flat configs...
)
```

> Note that `.eslintignore` no longer works in Flat config, see [customization](#customization) for more details.

</details>

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## IDE Support (auto fix on save)

<details>
<summary>🟦 VS Code support</summary>

<br>

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in your IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

</details>

<details>
<summary>🔲 Zed support</summary>

<br>

Add the following settings to your `.zed/settings.json`:

```jsonc
{
  "format_on_save": "on",
  // Use ESLint's --fix:
  "code_actions_on_format": {
    "source.fixAll.eslint": true
  },
  "formatter": [],
  // Enable eslint for all supported languages
  // Defaults only include https://github.com/search?q=repo%3Azed-industries%2Fzed%20eslint_languages&type=code
  "languages": {
    "HTML": {
      "language_servers": ["...", "eslint"]
    },
    "Markdown": {
      "language_servers": ["...", "eslint"]
    },
    "Markdown-Inline": {
      "language_servers": ["...", "eslint"]
    },
    "JSON": {
      "language_servers": ["...", "eslint"]
    },
    "JSONC": {
      "language_servers": ["...", "eslint"]
    },
    "YAML": {
      "language_servers": ["...", "eslint"]
    },
    "CSS": {
      "language_servers": ["...", "eslint"]
    }
    // Add other languages as needed
  },
  "lsp": {
    "eslint": {
      "settings": {
        "workingDirectories": ["./"],

        // Silent the stylistic rules in your IDE, but still auto fix them
        "rulesCustomizations": [
          { "rule": "style/*", "severity": "off", "fixable": true },
          { "rule": "format/*", "severity": "off", "fixable": true },
          { "rule": "*-indent", "severity": "off", "fixable": true },
          { "rule": "*-spacing", "severity": "off", "fixable": true },
          { "rule": "*-spaces", "severity": "off", "fixable": true },
          { "rule": "*-order", "severity": "off", "fixable": true },
          { "rule": "*-dangle", "severity": "off", "fixable": true },
          { "rule": "*-newline", "severity": "off", "fixable": true },
          { "rule": "*quotes", "severity": "off", "fixable": true },
          { "rule": "*semi", "severity": "off", "fixable": true }
        ]
      }
    }
  }
}
```

</details>

<details>
<summary>🟩 Neovim Support</summary>

<br>

Update your configuration to use the following:

```lua
local customizations = {
  { rule = 'style/*', severity = 'off', fixable = true },
  { rule = 'format/*', severity = 'off', fixable = true },
  { rule = '*-indent', severity = 'off', fixable = true },
  { rule = '*-spacing', severity = 'off', fixable = true },
  { rule = '*-spaces', severity = 'off', fixable = true },
  { rule = '*-order', severity = 'off', fixable = true },
  { rule = '*-dangle', severity = 'off', fixable = true },
  { rule = '*-newline', severity = 'off', fixable = true },
  { rule = '*quotes', severity = 'off', fixable = true },
  { rule = '*semi', severity = 'off', fixable = true },
}

local lspconfig = require('lspconfig')
-- Enable eslint for all supported languages
lspconfig.eslint.setup(
  {
    filetypes = {
      "javascript",
      "javascriptreact",
      "javascript.jsx",
      "typescript",
      "typescriptreact",
      "typescript.tsx",
      "vue",
      "html",
      "markdown",
      "json",
      "jsonc",
      "yaml",
      "toml",
      "xml",
      "gql",
      "graphql",
      "astro",
      "svelte",
      "css",
      "less",
      "scss",
      "pcss",
      "postcss"
    },
    settings = {
      -- Silent the stylistic rules in your IDE, but still auto fix them
      rulesCustomizations = customizations,
    },
  }
)
```

### Neovim format on save

There's few ways you can achieve format on save in neovim:

- `nvim-lspconfig` has a `EslintFixAll` command predefined, you can create a autocmd to call this command after saving file.

```lua
lspconfig.eslint.setup({
  --- ...
  on_attach = function(client, bufnr)
    vim.api.nvim_create_autocmd("BufWritePre", {
      buffer = bufnr,
      command = "EslintFixAll",
    })
  end,
})
```

- Use [conform.nvim](https://github.com/stevearc/conform.nvim).
- Use [none-ls](https://github.com/nvimtools/none-ls.nvim)
- Use [nvim-lint](https://github.com/mfussenegger/nvim-lint)

</details>

## Customization

Since v1.0, this config has used [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), which provides better organization and composition.

Normally you only need to import the `setemiojo` preset:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo()
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  // Type of the project. 'lib' for libraries, the default is 'app'
  type: 'lib',

  /**
   * `.eslintignore` is no longer supported in Flat config, use `ignores` instead
   * The `ignores` option in the option (first argument) is specifically treated to always be global ignores
   * And will **extend** the config's default ignores, not override them
   * You can also pass a function to modify the default ignores
   */
  ignores: [
    '**/fixtures',
    // ...globs
  ],

  /** Parse the `.gitignore` file to get the ignores, on by default */
  gitignore: true,

  // Enable stylistic formatting rules
  // stylistic: true,

  /** Or customize the stylistic rules */
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
    braceStyle: 'stroustrup', // '1tbs', or 'allman'
  },

  // TypeScript, Vue, and React are autodetected, you can also explicitly enable them:
  typescript: true,
  vue: true,
  react: true,

  /** Disable jsonc and yaml support */
  jsonc: false,
  yaml: false,
})
```

The `setemiojo` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo(
  {
    // Configure this preset
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
)
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

This style is not recommended unless you understand how the shared options interact, as extra care may be needed to keep the individual configs consistent.

```js
// eslint.config.js
import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from '@setemiojo/eslint-config'

export default combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  stylistic(),
  vue(),
  jsonc(),
  yaml(),
  toml(),
  markdown(),
)
```

</details>

Check out the [configs](https://github.com/oluwasetemi/eslint-config/blob/main/src/configs) and [factory](https://github.com/oluwasetemi/eslint-config/blob/main/src/factory.ts) for more details.

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

### Plugins Renaming

Flat config requires plugin names to be provided explicitly instead of deriving them from npm package names. This preset renames some plugins to make the overall scope more consistent and easier to write.

| New Prefix | Original Prefix        | Source Plugin                                                                                         |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `import/*` | `import-lite/*`        | [eslint-plugin-import-lite](https://github.com/9romise/eslint-plugin-import-lite)                     |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                                |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                                   |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)            |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)                      |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                           |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)             |
| `next/*`   | `@next/next`           | [@next/eslint-plugin-next](https://github.com/vercel/next.js/tree/canary/packages/eslint-plugin-next) |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

> [!NOTE]
> Plugin renaming can lead to naming collisions, as discussed [here](https://github.com/eslint/eslint/discussions/17766) and [here](https://github.com/prettier/eslint-config-prettier#eslintconfigjs-flat-config-plugin-caveat). This personal, opinionated preset is intended to be the only **"top-level"** config in a project.
>
> The renaming prioritizes user-facing DX over implementation details. For example, users can keep using the semantic `import/order` even if the underlying plugin implementation changes.
>
> That said, it's probably still not a good idea. You might not want to do this if you are maintaining your own eslint config.
>
> Open an issue if combining this preset with another config causes naming collisions. There are currently no plans to revert the renaming.

Since v2.9.0, this preset will automatically rename the plugins also for your custom configs. You can use the original prefix to override the rules directly.

<details>
<summary>Change back to original prefix</summary>

If you really want to use the original prefix, you can revert the plugin renaming by:

```ts
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo()
  .renamePlugins({
    ts: '@typescript-eslint',
    yaml: 'yml',
    node: 'n',
    // ...
  })
```

</details>

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo(
  {
    vue: true,
    typescript: true
  },
  {
    /** Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files */
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  {
    /** Without `files`, they are general rules for all files (Markdown excluded, see note below) */
    rules: {
      'style/semi': ['error', 'never'],
    },
  }
)
```

> [!NOTE]
> Rule overrides without an explicit `files` constraint are automatically excluded from Markdown files, via [`composer.setDefaultIgnores`](https://github.com/antfu/eslint-flat-config-utils#composersetdefaultignores). This prevents JS-only rules (e.g. `no-irregular-whitespace`, `perfectionist/sort-imports`) from crashing on `@eslint/markdown`'s `SourceCode`, which doesn't expose JS-specific methods like `getAllComments()`. If you want a rule to apply to Markdown, scope it explicitly with `files: ['**/*.md']`.

Each integration also provides an `overrides` option:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  vue: {
    overrides: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'interface'],
    },
    /** type aware rules overrides should write here */
    overridesTypeAware: {
      'ts/no-unsafe-assignment': ['warn'],
    }
  },
  yaml: {
    overrides: {
      // ...
    },
  },
})
```

### Config Composer

Since v2.10.0, the factory function `setemiojo()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo()
  .prepend(
    // some configs before the main config
  )
  // overrides any named configs
  .override(
    'setemiojo/stylistic/rules',
    {
      rules: {
        'style/generator-star-spacing': ['error', { after: true, before: false }],
      }
    }
  )
  // rename plugin prefixes
  .renamePlugins({
    'old-prefix': 'new-prefix',
    // ...
  })
// ...
```

### Vue

Vue support is detected automatically by checking if `vue` is installed in your project. You can also explicitly enable/disable it:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  vue: true
})
```

#### Vue 2

This package has limited support for Vue 2 (as it has already [reached EOL](https://v2.vuejs.org/eol/)). If you are still using Vue 2, you can configure it manually by setting `vueVersion` to `2`:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  vue: {
    vueVersion: 2
  },
})
```

As Vue 2 is in maintenance mode, only bug fixes are accepted for this integration. Support may be removed when `eslint-plugin-vue` drops Vue 2. Upgrading to Vue 3 is recommended where possible.

#### Vue Accessibility

To enable Vue accessibility support, you need to explicitly turn it on:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  vue: {
    a11y: true
  },
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-vuejs-accessibility
```

### Optional Configs

This package provides optional configs for specific use cases. Their dependencies are not installed by default.

#### Formatters

Use external formatters to format files that ESLint cannot handle yet (`.css`, `.html`, etc). Powered by [`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format).

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: 'prettier'
  }
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-format
```

#### React

React support is **automatically detected** when you have any of the following packages installed:

- `react` / `react-dom` (standard React)
- `@tanstack/react-router` / `@tanstack/start` (TanStack Router)

Alternatively, you can explicitly enable it:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  react: true,
})
```

The config automatically detects and optimizes rules for popular React frameworks:

- **Remix** (`@remix-run/dev`, `@remix-run/react`, etc.)
- **React Router v7** (`@react-router/node`, `@react-router/react`, etc.)
- **TanStack Router** (`@tanstack/react-router`, `@tanstack/start`)
- **Next.js** (when used with `nextjs: true`)

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @eslint-react/eslint-plugin eslint-plugin-react-refresh
```

#### TanStack Router

React support detects TanStack Router and TanStack Start automatically. To also enable the dedicated TanStack Router lint rules, turn on `tanstackRouter`:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  tanstackRouter: true,
})
```

Running `npx eslint` should prompt you to install the required dependency, otherwise, you can install it manually:

```bash
npm i -D @tanstack/eslint-plugin-router
```

#### Next.js

To enable Next.js support, you need to explicitly turn it on:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  nextjs: true,
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @next/eslint-plugin-next
```

#### Svelte

To enable svelte support, you need to explicitly turn it on:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  svelte: true,
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-svelte
```

#### Astro

To enable astro support, you need to explicitly turn it on:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  astro: true,
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-astro
```

#### Solid

To enable Solid support, you need to explicitly turn it on:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  solid: true,
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-solid
```

#### UnoCSS

To enable UnoCSS support, you need to explicitly turn it on:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  unocss: true,
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @unocss/eslint-plugin
```

#### Angular

To enable Angular support, you need to explicitly turn it on:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  angular: true,
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template @angular-eslint/template-parser
```

#### Anti-Slop

> [!WARNING]
> Experimental: the enabled rule set follows upstream and may change in any release without following semver.

To guard against low-value code patterns commonly introduced by AI agents, you can explicitly turn on the anti-slop rules:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  antislop: true,
})
```

This enables [`eslint-plugin-slop`](https://github.com/antfu/eslint-plugin-slop) and the curated subset of [`eslint-plugin-sonarjs`](https://github.com/SonarSource/SonarJS) rules inherited from upstream, focusing on redundant and duplicated code. It also disallows explicit `any` when TypeScript is enabled (inspired by [this writeup on keeping AI-authored code clean](https://zenn.dev/singularity/articles/clean-code-ci-for-ai-era)).

You can toggle each plugin and pass options to `eslint-plugin-slop`:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  antislop: {
    sonarjs: false,
    /**
     * an object enables `eslint-plugin-slop` and is forwarded to it
     * via `settings.slop`, for example to only inspect recently changed code
     */
    slop: {
      inspection: { mode: 'recent-changes', tracebackCommits: 5 },
    },
  },
})
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
npm i -D eslint-plugin-slop eslint-plugin-sonarjs
```

Since linters only see one file at a time, we recommend pairing this option with [`jscpd`](https://github.com/kucherenko/jscpd) to detect copy-paste duplication across files, and [`knip`](https://knip.dev) to find unused files, dependencies, and exports.

### Optional Rules

This config also provides some optional plugins/rules for extended usage.

#### `command`

Powered by [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command). It is not a typical rule for linting, but an on-demand micro-codemod tool that triggers by specific comments.

For a few triggers, for example:

- `/// to-function` - converts an arrow function to a normal function
- `/// to-arrow` - converts a normal function to an arrow function
- `/// to-for-each` - converts a for-in/for-of loop to `.forEach()`
- `/// to-for-of` - converts a `.forEach()` to a for-of loop
- `/// keep-sorted` - sorts an object/array/interface
- ... etc. - refer to the [documentation](https://github.com/antfu/eslint-plugin-command#built-in-commands)

You can add the trigger comment one line above the code you want to transform, for example (note the triple slash):

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg)
}
```

Will be transformed to this when you hit save with your editor or run `eslint --fix`:

```ts
async function foo(msg: string): void {
  console.log(msg)
}
```

The command comments are usually one-off and will be removed along with the transformation.

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the options object to the `typescript` config:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
})
```

### Prettier

If you use Prettier separately from ESLint, append `eslint-config-prettier` to disable conflicting formatting rules:

```js
import setemiojo from '@setemiojo/eslint-config'
import prettierConflicts from 'eslint-config-prettier'

export default setemiojo({
  rules: {
    'some-rule': 'off'
  }
}, prettierConflicts)
```

### Editor Specific Disables

Auto-fixing for the following rules are disabled when ESLint is running in a code editor:

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`test/no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)
- [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)
- [`pnpm/json-enforce-catalog`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules)
- [`pnpm/json-prefer-workspace-settings`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules)
- [`pnpm/json-valid-catalog`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules)

> Since v3.16.0, they are no longer disabled, but made non-fixable using [this helper](https://github.com/antfu/eslint-flat-config-utils#composerdisablerulesfix).

This is to prevent unused imports from getting removed by the editor during refactoring to get a better developer experience. Those rules will be applied when you run ESLint in the terminal or [Lint Staged](#lint-staged). If you don't want this behavior, you can disable them:

```js
// eslint.config.js
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  isInEditor: false
})
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

and then

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

## View what rules are enabled

Use Anthony Fu's [@eslint/config-inspector](https://github.com/eslint/config-inspector) to see which rules are enabled and which files they apply to.

Go to your project root that contains `eslint.config.js` and run:

```bash
npx @eslint/config-inspector
```

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/) for releases. However, since this is just a config and involves opinions and many moving parts, we don't treat rules changes as breaking changes.

### Changes Considered as Breaking Changes

- Node.js version requirement changes
- Huge refactors that might break the config
- Plugins made major changes that might break the config
- Changes that might affect most of the codebases

### Changes Considered as Non-breaking Changes

- Enable/disable rules and plugins (that might become stricter)
- Rules options changes
- Version bumps of dependencies

## FAQ

### Prettier?

See Anthony Fu's explanation of [why the upstream config does not use Prettier](https://antfu.me/posts/why-not-prettier).

Well, you can still use Prettier to format files that are not supported well by ESLint yet, such as `.css`, `.html`, etc. See [formatters](#formatters) for more details.

### oxlint?

The upstream project has a plan to integrate [oxlint](https://github.com/oxc-project/oxc) to improve linting performance. Track progress in [Oxlint Integration Plan](https://github.com/antfu/eslint-config/issues/767).

### dprint?

[dprint](https://dprint.dev/) is a customizable formatter, but it follows the same general model as Prettier: it reads the AST and reprints the code from scratch. This can discard original line breaks and create inconsistent diffs, so this preset uses ESLint to format and lint JavaScript and TypeScript.

The formatter integration can use dprint for other files such as `.md`. See [formatters](#formatters) for more details.

### How to format CSS?

You can opt-in to the [`formatters`](#formatters) feature to format your CSS. Note that it's only doing formatting, but not linting. If you want proper linting support, give [`stylelint`](https://stylelint.io/) a try.

### Top-level Function Style, etc.

This config intentionally prefers function declarations for top-level functions, one-line `if` statements without braces, and other opinionated conventions. If those choices do not suit your project, disable them with:

```ts
import setemiojo from '@setemiojo/eslint-config'

export default setemiojo({
  lessOpinionated: true
})
```

### I prefer XXX...

Sure, you can configure and override rules locally in your project to fit your needs. If that still does not work for you, you can always fork this repo and maintain your own.

## Check Also

- [oluwasetemi/dotfiles](https://github.com/oluwasetemi/dotfiles) - My dotfiles
- [antfu/vscode-settings](https://github.com/antfu/vscode-settings) - Antfu's VS Code settings
- [antfu/starter-ts](https://github.com/antfu/starter-ts) - Starter template for TypeScript library
- [antfu/vitesse](https://github.com/antfu/vitesse) - Starter template for Vue & Vite app

## License

[MIT](./LICENSE) License. Original work &copy; 2019-PRESENT [Anthony Fu](https://github.com/antfu); fork modifications &copy; 2025-PRESENT [Oluwasetemi Ojo](https://github.com/oluwasetemi).
