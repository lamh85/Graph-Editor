const path = require('path')
const webpack = require('webpack')

module.exports = {
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  devtool: 'eval-source-map',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: [/node_modules/, /\.test\.js$/],
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
}
