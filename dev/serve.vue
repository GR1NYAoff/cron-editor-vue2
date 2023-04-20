<template>
  <div id="app">
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
    }
  }
};
</script>
