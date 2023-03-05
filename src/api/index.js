//基础路径
// const baseUrl = "http://ipv4.api.garinasset.com:8000"
const apiVersion =
  process.env.NODE_ENV === "production"
    // ? "https://api.garinasset.com/data/v1"
    ? "http://api-pro.garinasset.com:8000/data/v1"
    : "/data/v1";
import axios from "../utils/axiosInterceptors";

function setHeader() {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("access_token")}`;
}
export const links = () => {
  const url = `${apiVersion}/links`;
  return axios.get(url).then((res) => res.data);
};
export const fecthUserInfo = () => {
  const url = `${apiVersion}/user`;
  setHeader();
  return axios.get(url).then((res) => res.data);
};
export const Login = (param) => {
  const url = `${apiVersion}/auth/login`;
  let bodyFormData = new FormData();
  for (let i in param) {
    bodyFormData.append(i, param[i]);
  }
  return axios({
    method: "post",
    url: url,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};
// 用户注册接口
export const signUp = (params) => {
  const url = `${apiVersion}/signup`;
  return axios({
    method: "post",
    url: url,
    data: params,
  }).then((res) => res.data);
};
// 注册时获取预期信息
export const infrastructure = () => {
  const url = `${apiVersion}/signup/infrastructure`;
  return axios.get(url).then((res) => res.data);
};
export const getTags = (linkId) => {
  const url = `${apiVersion}/links/${linkId}/tags`;
  return axios.get(url).then((res) => res.data);
};
// 获取标签下的地区信息
export const getLocateInfo = (tagId) => {
  const url = `${apiVersion}/tags/${tagId}/geolocations`;
  return axios.get(url).then((res) => res.data);
};
// 初始化 获取所有区域数据
export const getCountries = () => {
  const url = `${apiVersion}/countries`;
  return axios.get(url).then((res) => res.data);
};
export const getRegions = (countryId) => {
  const url = `${apiVersion}/countries/${countryId}/regions`;
  return axios.get(url).then((res) => res.data);
};

export const getDataDetail = (tag_id, region_id) => {
  const url = `${apiVersion}/indicators/tags/${tag_id}/regions/${region_id}/list`;
  return axios.get(url).then((res) => res.data);
};
// 请求指标数据
export const getIndicatorDetail = (id) => {
  const url = `${apiVersion}/indicators/${id}/detail`;
  return axios.get(url).then((res) => res.data);
};

export const verify = (sub) => {
  const url = `${apiVersion}/signup/verify`;
  const params = { sub };
  return axios.get(url, params).then((res) => res.data);
};

// 添加指标自选
export const addFavorites = (indicator) => {
  const url = `${apiVersion}/user/favorites/set/add`;
  const params = { indicator };
  return axios.patch(url, params).then((res) => res.data);
};

// 取消指标自选
export const cancelFavorites = (indicator) => {
  const url = `${apiVersion}/user/favorites/set/cancel`;
  const params = { indicator };
  return axios.patch(url, params).then((res) => res.data);
};

// 获取自选指标
export const getFavorites = () => {
  const url = `${apiVersion}/user/favorites/set`;
  return axios.get(url).then((res) => res.data);
};

// 获取自选指标数据列表
export const getFavoritesList = () => {
  const url = `${apiVersion}/user/favorites/list`;
  return axios.get(url).then((res) => res.data);
};

// 自选指标排序
export const setFavoritesOrder = (data) => {
  const url = `${apiVersion}/user/favorites/set/order`;
  return axios.put(url, data).then((res) => res.data);
};

