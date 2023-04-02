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
    return Promise.resolve(data);
    // if (status === 200) {
    // } else {
    //   return Promise.reject(data);
    // }
  },
  (error) => {
    const { status, data } = error.response;
    const url = error.config.url
    let message = "";
    if (url === "/data/v1/signup/verify/email") {
      message = `${data?.status_description[0]}`;
    } else {
      const status_description  = data?.status_description || '';
      const showM =
        status_description && status_description[0]
          ? status_description[0]
          : "";
      message = `${showM}`;
    }
    Message.error(message);
    console.error(data, message);
    const excloudUlrs = ['/data/v1/auth/login', '/data/v1/signup/verify/email']
    if (status == 401 && !excloudUlrs.includes(url)) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(data);
  }
);
export default axios;
