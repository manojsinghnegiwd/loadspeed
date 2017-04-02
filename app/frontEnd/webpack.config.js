var webpack = require('webpack');

module.exports = {
  entry: [
    __dirname + '/index.jsx'
  ],
  module: {
    loaders: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel'
      },{
        test: /\.less$/,
        loaders: ["style", "css", "less"]
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.less']
  },
  output: {
    path: __dirname + '/static',
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  externals: {
    'Config': JSON.stringify(process.env.NODE_ENV == 'production' ? {
      host_url: "http://manojsinghnegi.com",
    } : {
      host_url: "http://localhost",
    })
  },
  plugins: [
    (process.env.NODE_ENV == 'production' ?
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }) : function () {}),
    (process.env.NODE_ENV == 'production' ?
      new webpack.optimize.UglifyJsPlugin({
        compress:{
          warnings: true
        }
      })
    : function () {})
  ],
  devServer: {
    contentBase: __dirname + '/dist',
    historyApiFallback: true
  }
}
