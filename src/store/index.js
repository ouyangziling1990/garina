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
    projectId: "",
    orgId:"",
    tenantId:""
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
  },
  actions: {
    INIT_PROJECT_ID(context, id) {
      context.commit("INIT_PROJECT_ID", id)
    },
    INIT_ORG_ID(context, id) {
      context.commit("INIT_ORG_ID", id)
    },
    INIT_TENANT_ID(context, id) {
      context.commit("INIT_TENANT_ID", id)
    },
  }
})
