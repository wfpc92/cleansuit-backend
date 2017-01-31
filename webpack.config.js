const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './lib/dashboard.js',
    './public/css/dashboard.scss',
  ],
  output: {
    path: __dirname + "/public/dist",
    publicPath: "/dist/",
    filename: "[name].js",
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loader: 'babel'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(woff2?|svg|ttf|eot)(\?.*)?$/,
        loader: 'url'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    })
  ],
  externals: {
    'text-encoding': 'window'
  }
};
