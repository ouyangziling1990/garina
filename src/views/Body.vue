<!--
 * @Description: body compoment
 * @Version: 1.0
 * @Autor: wjw
 * @Date: 2021-03-29 16:10:21
 * @LastEditors: wjw
 * @LastEditTime: 2021-03-29 16:14:07
-->
<template>
  <div class="body_wrap" v-loading="loading">home
    <ul>
      <li v-for="item in linksArr" :key="item.id">{{item.name_link_json[0]}}</li>
    </ul>
  </div>
</template>

<script>
import { links } from "@/api/index";
export default {
  name: "bodyComp",
  components: {},
  computed: {},
  data() {
    return {
      loading: false,
      linksArr:[]

    };
  },
  mounted() {
    this.getLinks();
  },
  methods: {
    async getLinks() {
      this.loading = true;
      const res = await links();
      this.linksArr = res
      this.loading = false
      console.log(res);
    },
  },
};
</script>
