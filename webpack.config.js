const path = require('path')

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
  },

  output: {
    path: __dirname + '/dist',
    filename: 'app.bundle.js',
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
