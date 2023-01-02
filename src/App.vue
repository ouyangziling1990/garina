<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2021-03-29 16:10:21
 * @LastEditors: wjw
 * @LastEditTime: 2021-09-17 14:16:19
-->
<template>
  <div id="app">
      <router-view slot="body" />
  </div>
</template>

<script>
import { getRegions } from "@/api/index";
export default {
  name: "app",
  data() {
    return {
    }
  },
  methods: {
    //获取项目id
    init() {
      let id = this.$route.params.projectId
      this.projectId = id
      this.$store.commit("INIT_PROJECT_ID", id)
      let orgId = this.$route.params.orgId
      this.$store.commit("INIT_ORG_ID", orgId)
      let tenantId = this.$route.params.tenantId
      this.$store.commit("INIT_TENANT_ID", tenantId)
    },
    async getRegions(){
      const regions = await getRegions()
      if(regions){
        this.$store.commit('INIT_REGION', regions)
      }
    }
  },
  created() {
    this.getRegions()
    // this.init()
  }
}
</script>
<style lang="less">
html{
  // padding: 12px 16px !important;
}
#app{
  height: 100%;
}
</style>