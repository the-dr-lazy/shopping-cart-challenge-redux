const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')

const HTMLPlugin = require('html-webpack-plugin')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

function root(...args) {
  return path.resolve(__dirname, ...args)
}

const paths = {
  publicDir: root('public'),
}

module.exports = {
  entry: ['./src/index.tsx'],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsConfigPathsPlugin()],

    //
    // Production profiling.
    //
    alias: {
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    },
  },

  output: {
    path: __dirname + '/dist',
    filename: 'app.bundle.js',
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            safari10: true,
          },
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },

  plugins: [
    new HTMLPlugin({
      template: path.join(paths.publicDir, 'index.html'),
    }),
  ],
}
