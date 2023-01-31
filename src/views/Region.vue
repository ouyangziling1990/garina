<template>
  <div class="Region">
    <div class="show_data_wrap" v-show="showRegionsFlag">
      <Country @detail="RegionDetail"></Country>
      <!-- <div class="show_data">
        <p
          v-for="r in region"
          :class="[r.parent_id === null ? 'tag_detail_header' : 'tag_detail']"
          :key="r.id"
          @click="getReginIndexInfo(r)"
        >
          {{ r.id + r.region_json[0] }}
        </p>
      </div> -->
    </div>
    
  </div>
</template>

<script>
import { mapState } from "vuex";

import Country from "@/views/Country.vue";
export default {
  name: "Region",
  components: { Country },
  props: {},
  data() {
    return {
      treeData: [],
      showRegionsFlag:true,
      showTableFlag:false,
      defaultProps: {
        children: "children",
        label: "label",
      },
      tableData: [],
      
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState(["tagInfo"]),
  },
  watch: {
    region: {
      handler(val) {
        if (!val) return;
        // this.orgTreeData(val);
      },
      immediate: true,
    },
  },
  methods: {
    orgTreeData(val) {
      const map = {};
      const arr = [];
      val.forEach((item) => {
        item.label = item.region_json[0];
        map[item.id] = item;
        if (item.parent_id === null) {
          arr.push(item);
        }
      });
      val.forEach((item) => {
        if (item.parent_id) {
          const parent_id = item.parent_id;
          const parent = map[parent_id];
          if (parent) {
            const children = parent.children;
            if (!children) {
              parent.children = [item];
            } else {
              children.push(item);
            }
          }
        }
      });
      this.treeData = arr;
    },
    RegionDetail(item){
      console.log('regionDetail', item)
      this.$store.commit('Set_Current_Region', item)
      if(this.$router.currentRoute.name != 'tagDetail'){
        this.$router.push('/tagDetail')
      }
    }
  },
};
</script>
<style lang="less" scoped>
.Region {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 12px 20px;
  .show_data_wrap {
    display: flex;
    flex-direction: row;
  }
  .show_data {
    flex: 1;
  }
  
  .tag_detail_header {
    font-size: 20px;
    font-weight: bold;
    margin: 20px 0;
  }
  .tag_detail {
    color: #636e89;
    margin: 5px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
