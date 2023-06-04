<template>
  <div class="Country media-align">
    <!-- <div>
      <el-tree :data="region" :props="defaultProps"></el-tree>
    </div> -->
    <div v-for="(country, index) in countries" :key="'state' + country.id">
      <p class="title">{{ country.country_json[langArrIndex] }}</p>
      <div class="group">
        <div class="child" v-for="child1 in country.children">
          <span :class="{ allowed: child1.clickable }" @click="getRegions(child1)">{{
            child1.country_json[langArrIndex]
          }}</span>
          <template v-if="child1.children">
            <p class="region" v-for="region in child1.children">
              <span @click="getDetail(region)">{{ region.region_json[langArrIndex] }}</span>
            </p>
        </template>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Country",
  components: {},
  props: {},
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState(["countries", "langArrIndex"]),
  },
  watch: {},
  methods: {
    async getRegions(item) {
      const id = item.id;
      console.log("country", item);
      if(!item.clickable) return
      const path = `/region/${id}`
      this.$router.push(path)
      this.$store.commit("SET_LINK_ARR", {
        index: 2,
        pathInfo: { path:'/country', name: item.country_json },
      });
      // const regions = await getRegions(id);
      // console.log("regions", regions);
      // this.$store.commit('Set_Country_Children', {country:item, regions})
    },
    getDetail(region){
      this.$emit('detail', region)
    }
  },
};
</script>
<style lang="less" scoped>
.Country {
  // max-width: 1000px;
  // width: 100%;
  // margin: auto;
  // margin-left: 186px;
  padding-bottom: 100px;

  .title {
    font-size: 20px;
    margin: 40px 0px 20px;
    font-weight: bold;
  }
  .group {
    display: flex;
    flex-wrap: wrap;
  }
  .child {
    margin: 5px 15px 10px 0;;
    color: #aaaaaa;
    display: inline-block;
    line-height: 16px;

    & > span {
      cursor: not-allowed;
    }
    .allowed{
      cursor: pointer !important;
      font-size: 16px;
      color: #636e89;
      text-decoration: underline;
    }
  }

  .point {
    cursor: pointer;
    color: #636e89;
  }
  .region{
    padding: 10px;
    & > span {
      cursor: not-allowed;
    }
  }
}
</style>
