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
      popper-class="popup"
      >
      <!-- @blur="inputBlur" -->
      <i slot="suffix" class="el-input__icon el-icon-search"></i>
      <template slot-scope="{ item }">
        <div class="item">
          <span :class="['country', 'fi', `fi-${item.country_emoji_flag}`]"> </span>
          <span class="target">{{ item.region }}</span>
          <span class="target">{{ item.name }}</span>
        </div>
      </template>
    </el-autocomplete>
    <span class="el-icon-search white" v-if="!showInputFlag" @click="searchClick"></span>
    <el-drawer :with-header="false" size="100%" direction="rtl" :visible.sync="drawer.drawerFlag">
      <div class="wrap">
        <div class="header">
          <div class="left">
            <el-autocomplete
              ref="autocomplete1"
              class="inline-input"
              v-model="searchInput"
              :fetch-suggestions="querySearch"
              :placeholder="$t('search')"
              :trigger-on-focus="false"
              :autofocus="true"
              @select="handleSelect"
              @blur="inputBlur"
              popper-class="ziling-popup1"
              clearable
            >
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
              <template slot-scope="{ item }">
                <div class="item">
                  <span :class="['country', 'fi', `fi-${item.country_emoji_flag}`]"> </span>
                  <span class="target">{{ item.region }}</span>
                  <span class="target">{{ item.name }}</span>
                </div>
              </template>
            </el-autocomplete>
          </div>
          <div class="close">
            <i class="el-icon-close" @click="drawer.drawerFlag = false"></i>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { searchIndicators } from '@/api/index'

export default {
  data() {
    return {
      searchInput: null,
      showInputFlag: true,
      drawer: {
        drawerFlag: false,
      },
    }
  },
  created() {
    window.addEventListener('resize', this.resizeFun)
  },
  mounted() {
    this.resizeFun()
  },
  computed: {
    ...mapState(['langArrIndex']),
  },
  methods: {
    resizeFun() {
      const windowWidth = document.body.offsetWidth
      if (windowWidth > 1200) {
        this.showInputFlag = true
      } else {
        this.showInputFlag = false
      }
    },
    focus() {
      console.log('focus')
    },
    inputBlur() {
      this.showInputFlag = false
    },
    searchClick() {
      const windowWidth = document.body.offsetWidth
      if (windowWidth < 1200) {
        this.drawer.drawerFlag = true
      }
      // this.showInputFlag = true
      // this.$nextTick(() => {
      //   const autocomplete = this.$refs['autocomplete']
      //   autocomplete.focus()
      // })
    },
    async querySearch(queryString, cb) {
      console.log(queryString, cb)
      let res = await searchIndicators(queryString)
      console.log(res)
      if (res && res.length) {
        const list = res.map((item) => {
          return {
            id: item.id,
            name: item.names.name_json[this.langArrIndex],
            country_emoji_flag: item.countries.iso3166_alpha2.toLowerCase(),
            region: item.regions.region_json[this.langArrIndex],
          }
        })
        cb(list)
      } else {
        return cb([])
      }
    },
    handleSelect({ id }) {
      let pathInfo = this.$router.resolve(`/indicator/${id}`)
      window.open(pathInfo.href, '_blank')
    },
  },
}
</script>

<style lang="less" scoped>
.wrap {
  // margin-top: 1rem;
  padding: 1rem;
  .header {
    display: flex;
    .left {
      flex: 1;
    }
    .close {
      margin-left: 1rem;
      height: 40px;
      line-height: 40px;
      font-size: 1.5rem;
      // width: 40px;
    }
  }
}
.white {
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
<style lang="less">
.popup {
  min-width: 339px;
  width: auto !important;
}
.ziling-popup1 {
  border: unset;
  box-shadow: none;
  .el-autocomplete-suggestion__wrap{
    padding-top: 0px
  }
  li {
    padding: 0px;
    border-bottom: 1px solid #e8e8e8;
    height: 3rem;
    line-height: 3rem;
  }
}
</style>
