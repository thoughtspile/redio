var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: { index: './src/index.js' },
    output: {
      path: path.join(__dirname, 'build'),
      filename: "[name].js",
      library: "rescribe",
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    externals: {
      'react': 'commonjs react',
      'prop-types': 'commonjs prop-types'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          }
        }
      ]
    }
}
