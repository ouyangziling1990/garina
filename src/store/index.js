/*
 * @Description: init data
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2021-09-17 14:09:57
 * @LastEditors: wjw
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    linkInfo: {},
    projectId: "",
    orgId: "",
    tenantId: "",
    countries: [],
    regionMap: {},
    regionInfo: {},
    tagInfo: {},
    currentRegion: {},
    linkArr: [],
  },
  mutations: {
    INIT_PROJECT_ID(state, id) {
      state.projectId = id;
    },
    Set_Tag_Info(state, info) {
      state.tagInfo = info;
    },
    INIT_ORG_ID(state, id) {
      state.orgId = id;
    },
    INIT_TENANT_ID(state, id) {
      state.tenantId = id;
    },
    CHANG_LINK_INFO(state, info) {
      state.linkInfo = { linkInfo: info, tag: new Date().getTime() };
      state.linkArr[0] = {
        name: info.name_link_json[0],
        path: { path: `/tags/${info.id}` },
      };
    },
    SET_LINK_ARR(state, info){
      const {index, pathInfo} = info
      state.linkArr[index] = pathInfo
    },
    INIT_REGION(state, info) {
      state.countries = info;
    },
    INIT_REGION_MAP(state, info) {
      state.regionMap = info;
    },
    Set_Region_Info(state, info) {
      //当前哪些区域是可以点击的
      state.regionInfo = info;
      const ids = info.countries_id || [];
      ids.forEach((id) => {
        const country = state.regionMap.get(id);
        country.clickable = true;
      });
    },
    Set_Country_Children(state, info) {
      const { country, regions } = info;
      const key = country.id;
      const value = state.regionMap.get(key);
      Vue.set(value, "children", regions);
    },
    Set_Current_Region(state, info) {
      state.currentRegion = info;
    },
  },
  actions: {
    Set_Region_Info(context, info) {
      context.commit("Set_Region_Info", info);
    },
    Set_Current_Region(context, info) {
      context.commit("Set_Current_Region", info);
    },
    INIT_PROJECT_ID(context, id) {
      context.commit("INIT_PROJECT_ID", id);
    },
    INIT_REGION(context, region) {
      context.commit("INIT_REGION", region);
    },
    INIT_ORG_ID(context, id) {
      context.commit("INIT_ORG_ID", id);
    },
    INIT_TENANT_ID(context, id) {
      context.commit("INIT_TENANT_ID", id);
    },
    CHANG_LINK_INFO(context, linkInfo) {
      context.commit("CHANG_LINK_INFO", linkInfo);
    },
  },
});
