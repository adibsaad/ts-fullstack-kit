import { EsbuildPlugin } from 'esbuild-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import fs from 'fs/promises'
import path from 'path'
import webpack, { Configuration } from 'webpack'
import nodeExternals from 'webpack-node-externals'

import { simpleProgressOptions } from './helpers'

export default function configGen({ isProduction = false } = {}) {
  const options: Configuration = {
    stats: 'errors-warnings',
    optimization: {
      minimize: isProduction,
      minimizer: [new EsbuildPlugin()],
    },
    mode: isProduction ? 'production' : 'development',
    target: 'node',
    node: {
      // otherwise path gets confused. more @ https://webpack.js.org/configuration/node/#node-__dirname
      __dirname: true,
      __filename: true,
    },

    // For development, don't bundlle node_module deps, so it builds faster
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    externals: [!isProduction ? nodeExternals() : null].filter(Boolean),

    entry: {
      cli: path.join(__dirname, '..', 'src', 'cli', 'cli.ts'),
    },
    output: {
      // don't delete output path before building, because it's the dist folder
      clean: false,
      filename: '[name]',
      path: path.resolve(__dirname, '..', 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          loader: 'esbuild-loader',
          options: {
            target: 'es2022',
            tsconfig: path.resolve(
              __dirname,
              '..',
              'src',
              'cli',
              'tsconfig.json',
            ),
          },
        },
        {
          test: /\.html$/i,
          type: 'asset/source',
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@common': path.resolve(__dirname, '..', 'src', 'common'),
        '@server': path.resolve(__dirname, '..', 'src', 'server'),
      },
    },
    plugins: [
      // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/blob/main/examples/babel-loader/webpack.config.js
      new ForkTsCheckerWebpackPlugin({
        async: !isProduction,
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
          configFile: path.resolve(
            __dirname,
            '..',
            'src',
            'cli',
            'tsconfig.json',
          ),
          context: path.resolve(__dirname, '..', 'src', 'cli'),
        },
      }),
      new webpack.ProgressPlugin(simpleProgressOptions(isProduction)),
      // expose and write the allowed env vars on the compiled bundle
      new webpack.EnvironmentPlugin({
        NODE_ENV: isProduction ? 'production' : 'development',
      }),
      new webpack.BannerPlugin({
        banner: '#!/usr/bin/env node',
        raw: true,
        entryOnly: true,
      }),
      function () {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        this.hooks.done.tapPromise('Make executable', async () => {
          await fs.chmod(`${__dirname}/../dist/cli`, '755')
        })
      },
    ].filter(Boolean),
  }

  if (!isProduction) {
    options.devtool = 'cheap-module-source-map'
  } else {
    options.devtool = 'source-map'
  }

  return options
}
