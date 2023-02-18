<i18n>
    {
      "en": {
        "hello": "hello world!"
      },
      "zh-CN":{
        "hello":"你好"
      },
      "ja": {
        "hello": "こんにちは、世界！"
      }
    }
</i18n>
<template>
  <div class="LanguageTest">
    <p>message: {{ $t('hello') }}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "lang",
  components: {},
  props: {},
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  mounted() {
    console.log('lang')
    console.log('locale', this.$i18n.locale)
  },
  computed: {
    ...mapState([]),
  },
  watch: {},
  methods: {},
};
</script>
<style lang="less" scoped>
.LanguageTest {
}
</style>
