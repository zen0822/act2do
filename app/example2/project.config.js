module.exports = {
  apiUrl: '//example.com',
  baseUrl: './',
  execute: './main.tsx',
  bundleAnalyzer: true, // 打包文件的分析
  gzip: true,
  hotPort: 80,
  htmlName: 'index',
  htmlTitle: 'ex',
  name: 'example',
  outDir: './dist',
  staticDir: 'static',
  tpl: true,
  type: 'spa',
  webpack(config) {
    // see https://github.com/neutrinojs/webpack-chain for config.
    config.module
      .rule('protocol')
      .test(/protocol-[\w\W]+.html$/)
      .use('extract')
      .loader('extract-loader')
      .end()
      .use('html')
      .loader('html-loader')
      .end()
      .use('file')
      .loader('file-loader')
      .options({
        name: 'static/[name].[ext]',
        publicPath: './'
      })
      .end()

    return config
  }
}
