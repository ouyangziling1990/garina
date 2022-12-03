//基础路径
// const baseUrl = "http://ipv4.api.garinasset.com:8000"
const apiVersion = "/v1"
import axios from 'axios'

export const links = ()=>{
  const url = apiVersion + '/links'
  return axios.get(url).then(res=>res)
}
