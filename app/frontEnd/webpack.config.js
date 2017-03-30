module.exports = {
  entry: [
    './index.jsx'
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
  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  }
}
