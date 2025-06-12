import commonServerConfig from './webpack_backend.config'

import path = require('path')

export default function configGen({ isProduction = false } = {}) {
  const options = commonServerConfig({ isProduction })

  if (options.output) {
    options.output.path = path.resolve(__dirname, '..', 'dist', 'worker')
  }

  options.entry = isProduction
    ? {
        index: path.join(
          __dirname,
          '..',
          'src',
          'server',
          'entrypoints',
          'lambda_worker_entry.ts',
        ),
      }
    : {
        index: path.join(
          __dirname,
          '..',
          'src',
          'server',
          'entrypoints',
          'worker_entry.ts',
        ),
      }

  return options
}
