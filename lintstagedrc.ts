import path from 'path'

const buildEslintCommand = (filenames: string[]) =>
  `eslint --fix ${filenames.map((f: string) => `"${path.relative(process.cwd(), f)}"`).join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
