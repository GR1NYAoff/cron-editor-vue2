<template>
  <div id="app">
    <vue-cron-editor value="* * * * * ?" />
  </div>
</template>

<script>
import VueCronEditor from "../src/vue-cron-editor.vue";

export default {
  name: "ServeDev",
  components: {
    "vue-cron-editor": VueCronEditor,
  },
};
</script>
