//基础路径
// const baseUrl = "http://ipv4.api.garinasset.com:8000"
const apiVersion = "/v1"
import axios from 'axios'

export const links = ()=>{
  const url = apiVersion + '/links'
  return axios.get(url).then(res=>res)
}
export const Login = (param)=>{
  const url = apiVersion +'/auth/login'
  let bodyFormData = new FormData();
  for(let i in param){
    bodyFormData.append(i, param[i])
  }
  return axios({
    method:'post',
    url: url,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" }
  })
}
