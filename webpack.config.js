const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './lib/js/dashboard.js',
    './lib/css/dashboard.scss',
  ],
  output: {
    path: __dirname + "/public/dist",
    filename: "dashboard.js",
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
