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
    <router-view />
  </div>
</template>

<script>
import { getCountries } from '@/api/index'
export default {
  name: 'app',
  data() {
    return {
      countries: [],
    }
  },
  methods: {
    async getRegions() {
      const regions = await getCountries()
      if (regions) {
        const formatRegion = this.dealRegions(regions)
        this.$store.commit('INIT_REGION', formatRegion)
        this.countries = formatRegion
      }
    },
    dealRegions(regions) {
      const arr = [],
        map = new Map()
      regions.forEach((item) => {
        if (item.parent_id === null) {
          arr.push(item)
        }
        map.set(item.id, item)
        item.label = item.country_json[0]
        item.clickable = false
      })
      this.$store.commit('INIT_REGION_MAP', map)
      regions.forEach((item) => {
        if (item.parent_id != null) {
          const parentId = item.parent_id
          console.log('parentId', parentId)
          const parent = map.get(parentId)
          if (!parent.children) {
            parent.children = [item]
          } else {
            parent.children.push(item)
          }
        }
      })
      return arr
    },
  },
  created() {
    this.getRegions()
  },
}
</script>
<style lang="less">
html {
  // padding: 12px 16px !important;
}
#app {
  height: 100%;
  box-sizing: border-box;
  // font-size: 12px;
}
* {
  box-sizing: border-box;
}
.media-align {
  margin: 0 20px;
  @media screen and (min-width: 1540px) {
    margin-left: 185px;
    margin-right: 185px;
  }
}
</style>
