/*
 * @Description: 公用配置
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2019-12-31 14:28:56
 * @LastEditors: wjw
 * @LastEditTime: 2021-11-23 17:46:57
 */

import axios from "axios";
axios.interceptors.request.use(
  (config) => {
    let url = config.url;
    if (url && url.indexOf("api.glodon.com/v3/doc") != -1) {
      // console.log("处理文件上传的请求")
      delete config.headers.common["x-org-id"];
      delete config.headers.common["x-product-code"];
      delete config.headers.common["x-tenant-id"];
    }
    if (config.method == "post") {
      if (!config.data instanceof Array) {
        config.data = {
          ...config.data,
          _t: Date.parse(new Date()),
        };
      }
    } else if (config.method == "get") {
      config.params = {
        _t: Date.parse(new Date()),
        ...config.params,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axios.interceptors.response.use(
  (response) => {
    let { status, data } = response;
    if (status === 200) {
      return Promise.resolve(data);
    } else {
      return Promise.reject(data);
    }
  }
  // error => {
  //     let { status, data } = error.response,
  //         message = `${codeMap[status]} 具体信息：${data.message}`;
  //     Message.error(message);
  //     return Promise.reject(data)
  // }
);
export default axios;
