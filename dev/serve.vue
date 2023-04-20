<template>
  <div id="app">
    <el-input v-model="cronExpression" class="cron-input" />
    <vue-cron-editor v-model="cronExpression" />
  </div>
</template>

<script>
import VueCronEditor from "../src/vue-cron-editor.vue";

export default {
  name: "ServeDev",
  components: {
    "vue-cron-editor": VueCronEditor,
  },
  data() {
    return {
      cronExpression: "* * * * *",
    };
  },
};
</script>

<style scoped>
.cron-input {
  margin-bottom: 10px;
}
</style>
