var path = require('path')
var fs = require('fs')
var webpack = require('webpack')
var HtmlwebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var CleanPlugin = require('clean-webpack-plugin')
var CopyPlugin = require('copy-webpack-plugin')
var cssExtractor = new ExtractTextPlugin("css/base.css")
var stylExtractor = new ExtractTextPlugin("css/index.css")

var ROOT_PATH = path.resolve(__dirname)
var SRC_PATH = path.resolve(ROOT_PATH, 'src')
var DIST_PATH = path.resolve(ROOT_PATH, 'public')
var DEVELOP = process.env.NODE_ENV !== 'product'
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'

module.exports = {
  entry: {
    index: [hotMiddlewareScript, path.resolve(SRC_PATH, 'index')]
  },
  output: {
    path: DIST_PATH,
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: '/static'
  },
  module: {
    loaders:[
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.styl$/,
        loader: stylExtractor.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader!stylus-loader',
          publicPath: '../'
        })
      },
      {
        test:/\.css$/,
        loader: cssExtractor.extract({
          fallbackLoader:'style-loader',
          loader: 'css-loader',
          publicPath: '../'
        })
      },
      {
        test:/\.(png|jpg|gif)$/,
        loader:'url-loader?limit=8192&name=img/[name].[ext]?[hash]'
      },
      {
        test:/\.(eot|svg|ttf|TTF|woff)$/,
        loader:'url-loader?limit=1000&name=font/[name].[ext]?[hash]'
      }
    ]
  },
  resolve: {
    alias: {
      component: path.resolve(SRC_PATH, 'component'),
      css: path.resolve(SRC_PATH, 'css')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(DEVELOP ? 'dev'
                                       : 'production')
    }),
    new CleanPlugin(['public'], {
      root: ROOT_PATH,
      verbose: true,
      dry: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: DEVELOP,
      minimum: !DEVELOP,
      compress: {
        warnings: false
      }
    }),
    cssExtractor,
    stylExtractor,
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    hot: false,
    stats: 'normal'
  },
  devtool: DEVELOP ? 'source-map' : false
}
