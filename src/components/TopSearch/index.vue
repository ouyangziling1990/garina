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
      ref="autocomplete"
      v-if="showInputFlag"
      class="inline-input"
      v-model="searchInput"
      :fetch-suggestions="querySearch"
      :placeholder="$t('search')"
      :trigger-on-focus="false"
      :autofocus="true"
      @select="handleSelect"
      @blur="inputBlur"
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
    <span class="el-icon-search white" v-if="!showInputFlag" @click="searchClick"></span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { searchIndicators } from '@/api/index'

export default {
  data() {
    return {
      searchInput: null,
      showInputFlag: false
    }
  },
  created() {
    window.addEventListener("resize", this.resizeFun);
  },
  mounted () {
    this.resizeFun()  
  },
  computed: {
    ...mapState(['langArrIndex'])
  },
  methods: {
    resizeFun(){
      const windowWidth = document.body.offsetWidth;
      if(windowWidth > 1200){
        this.showInputFlag = true
      }else{
        this.showInputFlag = false
      }
    },
    focus(){
      console.log('focus')
    },
    inputBlur(){
      this.showInputFlag = false
    },
    searchClick(){
      this.showInputFlag = true
      this.$nextTick(()=>{
        const autocomplete = this.$refs['autocomplete']

        autocomplete.focus()
      })
    },
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
.white{
  color: #fff;
}
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
  min-width: 339px;
  width: auto !important;
}
</style>