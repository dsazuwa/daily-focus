import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import tailwindcss from 'eslint-plugin-tailwindcss';
import unicornX from 'eslint-plugin-unicorn-x';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  unicornX.configs.recommended,
  prettier,

  {
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss:
        /** @type {import('eslint-plugin-tailwindcss').PluginSettings} */
        ({
          cssConfigPath: './app/globals.css',
        }),
    },

    rules: {
      'unicorn-x/filename-case': 'off',
      'unicorn-x/prevent-abbreviations': 'off',

      // Tailwind CSS recommended rules
      'tailwindcss/enforces-canonical-classname': 'warn',
      'tailwindcss/enforces-negative-arbitrary-values': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/important-modifier-suffix': 'warn',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/no-contradicting-classname': 'warn',
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn',

      // Tailwind CSS overridden rules
      'tailwindcss/classnames-order': 'off', // handled by Prettier
      'tailwindcss/no-custom-classname': ['warn', { whitelist: [String.raw`custom\-*`] }],
    },
  },

  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
