import nextConfig from '@packages/eslint-config/next.mjs'
import { defineConfig, globalIgnores } from 'eslint/config'
import { resolve } from 'path'

const project = resolve(process.cwd())

const eslintConfig = defineConfig([
  ...nextConfig(project),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
