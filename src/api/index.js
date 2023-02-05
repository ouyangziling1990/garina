//基础路径
// const baseUrl = "http://ipv4.api.garinasset.com:8000"
const apiVersion =
  process.env.NODE_ENV === "production"
    ? "https://api.garinasset.com/data/v1"
    : "/data/v1";
import axios from "axios";
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
