const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


////////////////////////
// Helper functions
////////////////////////

// get all the html templates (all the lectures)
function getEntries (path) {
  return fs.readdirSync(path)
    .filter(file => file.match(/.*\.html$/))
    .map(file => {
      return {
        name: file.substring(0, file.length - 5),
        path: file
      }
    }).reduce((memo, file) => {
      memo[file.name] = file.path
      return memo
    }, {})
}

// generate a HTMLPlugin instance per html file
function getAllHTMLPlugins (htmlFiles) {
  return Object.entries(htmlFiles).map(([key, value]) => {
    return new HtmlWebpackPlugin({
            title: key,
            template: './' + value,
            filename: './' + value
        })
  })
}

////////////////////////////////////////
// PLUGINS ARRAY to be fed into webpack
////////////////////////////////////////

// 1- Add of all the HTMLplugin instances
let pluginsArray = getAllHTMLPlugins(getEntries('./src/'))

// 2- Add specific module replacement instance to fix wrong url
// as .css file imports will compile to CSS @import rules, the following is necessary
// since the url in white.scss will be wrong
pluginsArray.push(
  new webpack.NormalModuleReplacementPlugin(
    new RegExp('../../lib/font/source-sans-pro/source-sans-pro.css'),
    'reveal.js/lib/font/source-sans-pro/source-sans-pro.css')
  )

// 3- Those library will be directly available on the global scope
// (JQuery needed for custom animations to work in Reveal (reveal-animate-css.js))
pluginsArray.push(
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  })
)
pluginsArray.push(
  new webpack.ProvidePlugin({
    Reveal: 'reveal.js'
  })
)

// 4- Copy some needed files in hierarchy
const nodePath = '../node_modules/';
pluginsArray.push(
  new CopyWebpackPlugin([
    // speaker note base window
    { from: nodePath + 'reveal.js/plugin/notes/notes.html', to: 'js/reveal.js-dependencies/notes.html' },
    // styles for slides export to to pdf
    { from: { glob: nodePath + 'reveal.js/css/print/*.css' }, to: 'css/[name].css' },
    // modified styles for menu.js plugin (compatible with inline svg)
    { from: 'styles/menu-inline-svg.css', to: 'css/menu.css' },
    // any files in content
    { context: 'content',
      from: '**/*',
      to: 'content/'
    }
  ])
)

// 4- Generate styles file from (scss + css)
pluginsArray.push(
  new ExtractTextPlugin({filename:'css/presentation.bundle.css'}),
)

// 5- When ready for production
// pluginsArray.push(
//   new UglifyJsPlugin()
// )

//////////////////////////
// WEBPACK CONFIG ITSELF
/////////////////////////

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: './scripts/main.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'js/presentation.bundle.js'
  },
  // externals: {
  //   'reveal': {root: 'Reveal'}
  // },
  module: {
    rules:[
      { test:/\.(s*)css$/,
        use: ExtractTextPlugin.extract({
              fallback:'style-loader',
              use:['css-loader', 'sass-loader']
        })
      },
      { test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          { loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: '../' // bundle.css will be in css, need to go back up in the hierarchy
            }
          }
        ]
      }
    ]
  },
  // watch:true,
  devServer: {
    contentBase: path.join(__dirname, "build/"),
    port: 9000
  },
  plugins: pluginsArray
};
