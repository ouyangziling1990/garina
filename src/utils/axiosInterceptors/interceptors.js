/*
 * @Description: 公用配置
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2019-12-31 14:28:56
 * @LastEditors: wjw
 * @LastEditTime: 2021-11-23 17:46:57
 */

import axios from "axios";
import codeMap from "./codeMap";
import { Message } from "element-ui";
axios.interceptors.request.use(
  (config) => {
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
    console.log(response);
    if (status === 200) {
      return Promise.resolve(data);
    } else {
      return Promise.reject(data);
    }
  },
  (error) => {
    const { status, data } = error.response;
    const url = error.config.url
    let message = "";
    if (url === "/data/v1/signup/verify") {
      message = `具体信息 ${data?.detail[0].msg},邮箱验证失败`;
    } else {
      const status_description  = data?.status_description || '';
      const showM =
        status_description && status_description[0]
          ? status_description[0]
          : "";
      message = `${codeMap[status] || ""} 具体信息：${showM}`;
    }
    Message.error(message);
    console.error(message);
    if (status == 401 && url !='/data/v1/auth/login') {
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }
    return Promise.reject(data);
  }
);
export default axios;
