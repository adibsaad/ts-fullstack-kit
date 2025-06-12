import { sentryWebpackPlugin } from '@sentry/webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { EsbuildPlugin } from 'esbuild-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import path from 'path'
import webpack, { Configuration } from 'webpack'
import nodeExternals from 'webpack-node-externals'
import ZipPlugin from 'zip-webpack-plugin'

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

    // For development, don't bundle node_module deps, so it builds faster
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    externals: [!isProduction ? nodeExternals() : null].filter(Boolean),

    output: {
      // delete output path before building
      clean: true,
      // Set path in calling function
      // path: <>
      filename: '[name].js',
      library: '[name]',
      libraryTarget: 'commonjs2',
    },

    resolve: {
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],

      alias: {
        '@common': path.resolve(__dirname, '..', 'src', 'common'),
        '@server': path.resolve(__dirname, '..', 'src', 'server'),
      },
    },

    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          loader: 'esbuild-loader',
          options: {
            target: 'node18',
            tsconfig: path.resolve(
              __dirname,
              '..',
              'src',
              'server',
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

        // https://github.com/mjmlio/mjml/issues/2173#issuecomment-1970563745
        {
          test: /html-minifier/,
          use: 'null-loader',
        },
      ],
    },

    plugins: [
      new ForkTsCheckerWebpackPlugin({
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
            'server',
            'tsconfig.json',
          ),
          context: path.resolve(__dirname, '..', 'src', 'server'),
        },
      }),
      new webpack.ProgressPlugin(simpleProgressOptions(isProduction)),
      // clean the build folder
      new CleanWebpackPlugin({
        verbose: true,
        cleanStaleWebpackAssets: true,
      }),
      isProduction &&
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(
                __dirname,
                '..',
                'src',
                'server',
                'prisma',
                'schema.prisma',
              ),
              to: './',
            },
          ],
        }),
      isProduction &&
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(
                __dirname,
                '..',
                'node_modules',
                '.prisma',
                'client',
                'libquery_engine-rhel-openssl-1.0.x.so.node',
              ),
              to: './',
            },
          ],
        }),
      isProduction &&
        sentryWebpackPlugin({
          org: process.env.SENTRY_SOURCEMAP_ORG,
          project: process.env.SENTRY_SOURCEMAP_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
          telemetry: false,
        }),
      isProduction &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        new ZipPlugin({
          filename: `build.zip`,
          exclude: [/\.map$/],
        }),
    ].filter(Boolean),
  }

  if (!isProduction) {
    options.devtool = 'cheap-module-source-map'
  } else {
    options.devtool = 'source-map'
  }

  return options
}
