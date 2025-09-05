import path from 'path'

import commonServerConfig from './webpack_backend.config'

export default function configGen({ isProduction = false } = {}) {
  const options = commonServerConfig({ isProduction })

  if (options.output) {
    options.output.path = path.resolve(__dirname, '..', 'dist', 'lambda')
  }

  if (!isProduction) {
    throw new Error('Lambda builds must be in production mode')
  }

  options.entry = {
    index: path.join(
      __dirname,
      '..',
      'src',
      'server',
      'entrypoints',
      'lambda-entry.ts',
    ),
  }

  return options
}
