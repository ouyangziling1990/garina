<template>
  <div class="Country">
    <!-- <div>
      <el-tree :data="region" :props="defaultProps"></el-tree>
    </div> -->
    <div v-for="(country, index) in countries" :key="'state' + country.id">
      <p class="title">{{ country.country_json[langArrIndex] }}</p>

      <p
        class="child"
        v-for="child1 in country.children"
      >
        <span :class="{ allowed: child1.clickable }" @click="getRegions(child1)">{{
          child1.country_json[langArrIndex]
        }}</span>
        <template v-if="child1.children">
          <p class="region" v-for="region in child1.children">
            <span @click="getDetail(region)">{{ region.region_json[langArrIndex] }}</span>
          </p>
        </template>
      </p>

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
  width: 100%;
  padding: 0 20px 10px;
  display: flex;
  flex-direction: row;
  & > div {
    flex: 1;
  }
  .title {
    font-size: 20px;
    margin: 20px 10px;
    font-weight: bold;
  }
  .child {
    padding: 10px;
    color: #636e89;
    & > span {
      cursor: not-allowed;
    }
    .allowed{
      cursor: pointer !important;
      font-size: 16px;
      color: rgb(10, 154, 206);
    }
  }

  .point {
    cursor: pointer;
    color: rgb(10, 154, 206);
  }
  .region{
    padding: 10px;
    & > span {
      cursor: not-allowed;
    }
  }
}
</style>
