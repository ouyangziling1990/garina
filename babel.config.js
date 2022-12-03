/*
 * @Description: babel配置项
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2021-03-29 16:03:01
 * @LastEditors: wjw
 * @LastEditTime: 2021-04-08 19:57:23
 */
module.exports = {
  "presets": [["@vue/cli-plugin-babel/preset", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "@geip/basic-components",
        "styleLibraryName": "theme-default"
      }
    ]
  ]
}
