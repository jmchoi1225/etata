module.exports = {
  entry:{
    index : './src/index.js',
    registration : './src/registration.js'
  },
  output:{
      filename: '[name].min.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] 
      }
    ]
  }
}