import path from 'path'

import commonServerConfig from './webpack_backend.config'

export default function configGen({ isProduction = false } = {}) {
  const options = commonServerConfig({ isProduction })

  if (options.output) {
    options.output.path = path.resolve(__dirname, '..', 'dist', 'server')
  }

  options.entry = isProduction
    ? {
        index: path.join(
          __dirname,
          '..',
          'src',
          'server',
          'entrypoints',
          'lambda_server_entry.ts',
        ),
      }
    : {
        index: path.join(
          __dirname,
          '..',
          'src',
          'server',
          'entrypoints',
          'server_entry.ts',
        ),
      }

  return options
}
