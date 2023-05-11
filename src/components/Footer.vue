<template>
  <div class="Footer">
    <div class="footer-cont">
      <div class="cont-t">
        <a href="/testPage">联系我们</a>
        <a href="/testPage">职业机会</a>
        <a href="/testPage">关于</a>
      </div>
      <div class="cont-b">
        <div class="cont-b-l">
          <a href="/testPage">版权所有 © 2022-2023 GARIN ASSET LLC</a>
          <a href="/testPage">京ICP备14007898号 京公网安备786554321号</a>
        </div>
        <div class="cont-b-r">
          <a href="/testPage">隐私政策</a>
          <el-divider class="divider" direction="vertical"></el-divider>
          <a href="/testPage">使用条款</a>
          <el-divider class="divider" direction="vertical"></el-divider>
          <a href="/testPage">销售政策</a>
          <el-divider class="divider" direction="vertical"></el-divider>
          <a href="/testPage">法律信息</a>
          <el-divider class="divider" direction="vertical"></el-divider>
          <a href="/testPage">网站地图</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  computed: {
    ...mapState([]),
  },
  watch: {},
  methods: {},
};
</script>
<style lang="less" scoped>
.Footer {
  box-sizing: border-box;
  height: 200px;
  background-color: rgba(215, 217, 215, 0.2);
  padding: 30px 0 10px;
  width: 100%;
  a {
    margin-bottom: 10px;
    text-decoration: none;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .footer-cont {
    @media screen and (min-width: 1540px) {
      margin-left: 185px;
      margin-right: 185px;
    }
    margin: 0 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .cont-t {
      a {
        color: #282728;

        margin-right: 20px;
      }
    }
    .cont-b {
      display: flex;
      font-size: 0.75rem;
      flex-wrap: wrap;
      .cont-b-l {
        display: flex;
        flex-wrap: wrap;
        margin-right: 40px;
        a {
          color: #6e706f;
          margin-right: 20px;
        }
      }
      .cont-b-r {
        a {
          color: #282728;
        }
        .divider {
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
