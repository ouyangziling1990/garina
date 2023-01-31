/*
 * @Description: vue cli配置项
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2021-03-29 16:07:54
 * @LastEditors: wjw
 * @LastEditTime: 2021-06-18 10:27:22
 */
//启动项目时自动打开浏览器的插件
const OpenBrowserPlugin = require("open-browser-webpack-plugin")
//打包前自动清空dist目录的插件
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
//端口号
const theDefaultPort = 2019
const _baseUrl = process.env.NODE_ENV === "production" ? "./" : "/"
module.exports = {
  publicPath: _baseUrl,
  outputDir: "dist/Garina",
  assetsDir: "static",
  lintOnSave: false,
  // chainWebpack: config => {},
  configureWebpack: config => {
    // console.log(config)
    if (process.env.NODE_ENV === "production") {
      // 生产环境配置
      // 去掉console.log
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      return {
        plugins: [new CleanWebpackPlugin()]
      }
    } else {
      // 开发环境配置
      return {
        plugins: [
          new OpenBrowserPlugin({
            url:
              "http://localhost:" +
              theDefaultPort +
              "/index.html#/"
          })
        ]
      }
    }
  },
  productionSourceMap: process.env.NODE_ENV === "production" ? false : true,
  css: {
    sourceMap: process.env.NODE_ENV === "production" ? false : true,
    loaderOptions: {},
    requireModuleExtension: true
  },
  parallel: require("os").cpus().length > 1,
  pwa: {},
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: theDefaultPort,
    https: false,
    hotOnly: false,
    proxy: {
      "/data": {
        target: "https://api.garinasset.com",
        changeOrigin: true,
        secure: false
      }
    }
    // before: app => {}
  },
  pluginOptions: {}
}
