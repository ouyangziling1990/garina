<i18n>
  {
    "en": {
      "search":"Search"
    },
    "zh-CN":{
      "search":"搜索"
    }
  }
</i18n>
<template>
  <div class="search">
    <!-- <el-input v-model="searchInput" :placeholder="$t('search')">
      <i slot="suffix" class="el-input__icon el-icon-search"></i>
    </el-input> -->
    <el-autocomplete
      class="inline-input"
      v-model="searchInput"
      :fetch-suggestions="querySearch"
      :placeholder="$t('search')"
      :trigger-on-focus="false"
      @select="handleSelect"
      popper-class="popup"
    >
      <i slot="suffix" class="el-input__icon el-icon-search"></i>
      <template slot-scope="{ item }">
        <div class="item">
          <span :class="['country', 'fi', `fi-${item.country_emoji_flag}`]">
          </span>
          <span class="target">{{ item.region }}</span>
          <span class="target">{{ item.name }}</span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { searchIndicators } from '@/api/index'

export default {
  data() {
    return {
      searchInput: null
    }
  },
  computed: {
    ...mapState(['langArrIndex'])
  },
  methods: {
    async querySearch(queryString, cb) {
      console.log(queryString, cb)
      let res = await searchIndicators(queryString)
      console.log(res)
      if (res && res.length) {
        const list = res.map(item => {
          return {
            id: item.id,
            name: item.names.name_json[this.langArrIndex],
            country_emoji_flag: item.countries.iso3166_alpha2.toLowerCase(),
            region: item.regions.region_json[this.langArrIndex]
          }
        })
        cb(list)
      } else {
        return cb([])
      }
    },
    handleSelect({id}) {
      let pathInfo = this.$router.resolve(`/indicator/${id}`)
      window.open(pathInfo.href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.inline-input {
  width: 100%;
}
.item {
  .country {
    display: inline-block;
  }
  .target {
    margin-left: 10px;
    display: inline-block;
  }
}
</style>
<style>
.popup {
  min-width: 300px;
  width: auto !important;
}
</style>