/*
 * @Description: get token
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2020-01-03 19:03:39
 * @LastEditors: wjw
 * @LastEditTime: 2021-12-07 11:16:13
 */
//获取token
import axios from 'axios'
async function GET_TOKEN(arg) {
    let userSetToken = arg.geipToken
    let params = null
    if(process.env.NODE_ENV == "production"){
        params = sessionStorage.getItem("garina$_info")
    }
    if (process.env.NODE_ENV == "development") {
    }
    if(params){
        params = JSON.parse(params)
        let {geipToken, orgId, tenantId, productCode} = params
        // 查看
        axios.defaults.headers.common["Authorization"] = `Bearer ${geipToken}`;
        axios.defaults.headers.common["x-tenant-id"] = tenantId;
        axios.defaults.headers.common["x-org-id"] = orgId;
        axios.defaults.headers.common["x-product-code"] = productCode;
    }else{
        if (process.env.NODE_ENV == "development") {
            if(userSetToken){
                // axios.defaults.headers.common["Authorization"] = `Bearer ${userSetToken}`;
                params = {'geipToken':userSetToken}
                localStorage.setItem('geipToken', userSetToken)
            }else{
                alert("未探寻得到geipToken，通过 1. 配置域名方式或者获取登录网站获取geipToke")
            }
        }else{
            // 在生产环境中还是使用原来的 cloudAccessToken
        }
    }
    return Promise.resolve(params)
}
export default GET_TOKEN