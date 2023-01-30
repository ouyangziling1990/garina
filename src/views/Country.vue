<template>
  <div class="Country">
    <div>
      <el-tree :data="region" :props="defaultProps"></el-tree>
    </div>
    <div>
      <div v-for="(item, index) in region" :key="'state' + item.id">
        <p class="title">{{ item.country_json[0] }}</p>
        <p
          class="child"
          v-for="child1 in item.children"
          @click="getRegions(child1)"
        >
          {{ child1.country_json[0] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getRegions } from "@/api/index";
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
    ...mapState(["region"]),
  },
  watch: {},
  methods: {
    async getRegions(item) {
      const id = item.id;
      console.log("country", item);
      const regions = await getRegions(id);
      console.log("regions", regions);
      // item.children = regions
    },
  },
};
</script>
<style lang="less" scoped>
.Country {
  padding: 20px;
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
    cursor: pointer;
  }
}
</style>
