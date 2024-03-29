/*
 * @Description: vue cli配置项
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2021-03-29 16:07:54
 * @LastEditors: wjw
 * @LastEditTime: 2021-06-18 10:27:22
 */
//启动项目时自动打开浏览器的插件
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
//打包前自动清空dist目录的插件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//端口号
const theDefaultPort = 2019;
module.exports = {
  publicPath: process.env.VUE_APP_URL,
  // publicPath: '/data.garinasset.com/',
  outputDir: "dist/Garina",
  assetsDir: "static",
  lintOnSave: false,
  chainWebpack: (config) => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();
  },
  configureWebpack: (config) => {
    // console.log(config)
    let configObj = {}
    if (process.env.NODE_ENV === "production") {
      // 生产环境配置
      // 去掉console.log
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      // return {
      //   plugins: [new CleanWebpackPlugin()],
      // };
    } else {
      // 开发环境配置
        configObj.plugins = [
          new OpenBrowserPlugin({
            url: "http://localhost:" + theDefaultPort + "/",
          }),
        ]
    }
    configObj.externals = {
      // CDN 的 Element 依赖全局变量 Vue， 所以 Vue 也需要使用 CDN 引入
      'vue': 'Vue',
      // 属性名称 element-ui, 表示遇到 import xxx from 'element-ui' 这类引入 'element-ui'的，
      // 不去 node_modules 中找，而是去找 全局变量 ELEMENT
      'element-ui': 'ELEMENT',
      'echarts':'echarts'
    }
    return configObj
  },
  productionSourceMap: process.env.NODE_ENV === "production" ? false : true,
  css: {
    sourceMap: process.env.NODE_ENV === "production" ? false : true,
    loaderOptions: {},
    requireModuleExtension: true,
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
        // target: "http://ipv6.api-pro.garinasset.com:8000",
        // target: "http://api-pro.garinasset.com:8000",
        changeOrigin: true,
        secure: false,
      },
    },
    // before: app => {}
  },
  pluginOptions: {},
};
