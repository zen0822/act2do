const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const Config = require('webpack-chain')
const webpackChainConfig = new Config()

module.exports = function ({
  config,
  extractScss = false
} = {}) {
  const babelLoader = {
    loader: 'babel-loader',
    options: {
      presets: [
        require.resolve('@babel/preset-react'),
        require.resolve('@babel/preset-typescript'),
        [require.resolve('@babel/preset-env'), {
          modules: false,
          targets: {
            browsers: ['last 2 versions', 'ie >= 10', 'iOS >= 8']
          }
        }]
      ],
      plugins: [
        require.resolve('@babel/plugin-syntax-dynamic-import'),
        require.resolve('@babel/plugin-transform-runtime'),
        require.resolve('@babel/plugin-transform-react-jsx-source'),
        require.resolve('react-hot-loader/babel')
      ]
    }
  }

  const utils = require(path.resolve(__dirname, `../script/util`))({
    config
  })
  const projectConfig = config.project
  const appName = projectConfig.name

  const globalRoot = config.global.root
  const projectPath = projectConfig.path
  let extractTextScss = null

  if (extractScss) {
    extractTextScss = new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[hash].css')
    })
  }

  const commonRule = {
    include: [
      projectPath,
      path.resolve(__dirname, '../util'),
      path.resolve(__dirname, '../../component')
    ]
  }

  let entryConfig = {}
  const configRule = {
    'jsx&tsx&pre': {
      ...commonRule,
      test: /\.(j|t)sx?$/,
      enforce: 'pre',
      use: {
        eslint: {
          loader: 'eslint-loader'
        }
      }
    },
    tsx: {
      ...commonRule,
      test: /\.tsx?$/,
      use: {
        babel: babelLoader,
        ts: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
            compilerOptions: {
              module: 'es6',
              noEmit: true
            }
          }
        }
      }
    },
    jsx: {
      ...commonRule,
      test: /\.jsx?$/,
      use: {
        babel: babelLoader
      }
    },
    'css&scss': {
      ...commonRule,
      test: /\.(css|scss)$/,
      use: {
        style: {
          loader: extractScss ? MiniCssExtractPlugin.loader : 'style-loader'
        },
        css: {
          loader: 'css-loader'
        },
        postcss: {
          loader: 'postcss-loader'
        },
        sass: {
          loader: 'sass-loader'
        }
      }
    },
    img: {
      ...commonRule,
      test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
      use: {
        url: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      }
    },
    media: {
      ...commonRule,
      test: /\.(mp3|aac|ogg)(\?.*)?$/,
      use: {
        file: {
          loader: 'file-loader'
        }
      }
    }
  }

  if (projectConfig.type === 'map') {
    const entryHub = utils.entryHub(path.resolve(projectPath, `./entry`))

    entryHub.forEach((entryName) => {
      entryConfig = {
        ...entryConfig,
        [entryName]: [
          path.resolve(projectPath, `./entry/${entryName}.tsx`)
        ]
      }
    })
  } else {
    entryConfig = {
      ...entryConfig,
      [appName]: [
        path.resolve(projectPath, './main.tsx')
      ]
    }
  }

  const baseConf = {
    mode: 'production',
    entry: entryConfig,
    module: {
      rule: configRule
    },
    output: {
      path: config.prod.assetRoot,
      filename: utils.assetsPath('js/[name].bundle.[hash:7].js')
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    plugin: {
      forkTsChecker: {
        plugin: ForkTsCheckerWebpackPlugin,
        args: [{
          eslint: true,
          async: true,
          watch: [projectPath],
          reportFiles: [projectPath]
        }]
      }
    },

    performance: {
      maxEntrypointSize: 104857600,
      maxAssetSize: 10485760
    },

    stats: 'verbose',

    resolve: {
      modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
        rootDir: globalRoot,
        libDir: path.resolve(globalRoot, './lib')
      }
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, '../node_modules'), 'node_modules']
    }
  }

  webpackChainConfig.merge(baseConf)

  if (config.zepto) {
    webpackChainConfig.module
      .rule('exportZepto')
      .test(require.resolve(path.resolve(globalRoot, './lib/zepto/zepto1.2.0.min.js')))
      .use('exports')
      .loader('exports-loader?window.$!script-loader')

    webpackChainConfig
      .plugin('webpackProvide')
      .use(webpack.ProvidePlugin, [{
        $: require.resolve(path.resolve(__dirname, `${globalRoot}/lib/zepto/zepto1.2.0.min.js`))
      }])
  }

  if (extractScss) {
    webpackChainConfig
      .plugin('extractTextScss')
      .use(extractTextScss)
  }

  const realwebpackChainConfig = projectConfig.webpack(webpackChainConfig)

  return realwebpackChainConfig
}
