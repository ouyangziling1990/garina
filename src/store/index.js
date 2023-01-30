/*
 * @Description: init data
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2021-09-17 14:09:57
 * @LastEditors: wjw
 */
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    linkInfo:"",
    projectId: "",
    orgId:"",
    tenantId:"",
    region:[]
  },
  mutations: {
    INIT_PROJECT_ID(state, id) {
      state.projectId = id
    },
    INIT_ORG_ID(state, id) {
      state.orgId = id
    },
    INIT_TENANT_ID(state, id) {
      state.tenantId = id
    },
    CHANG_LINK_INFO(state, info){
      state.linkInfo = info
    },
    INIT_REGION(state, info){
      state.region = info
    }
  },
  actions: {
    INIT_PROJECT_ID(context, id) {
      context.commit("INIT_PROJECT_ID", id)
    },
    INIT_REGION(context, region) {
      context.commit("INIT_REGION", region)
    },
    INIT_ORG_ID(context, id) {
      context.commit("INIT_ORG_ID", id)
    },
    INIT_TENANT_ID(context, id) {
      context.commit("INIT_TENANT_ID", id)
    },
    CHANG_LINK_INFO(context, linkInfo) {
      context.commit('CHANG_LINK_INFO', linkInfo)
    }
  }
})
