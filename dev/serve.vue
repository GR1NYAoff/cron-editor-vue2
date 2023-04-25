<template>
  <div id="app">
    <el-input v-model="cronExpression" class="cron-input" />
    <vue-cron-editor v-model="cronExpression" :localesButton="localesButton" @setText="setText" />
    <p>{{text}}</p>
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
      text: "",
      localesButton: true,
    };
  },
  methods: {
    setText(text) {
      this.text = text;
    }
  }
};
</script>

<style scoped>
.cron-input {
  margin-bottom: 10px;
}
</style>
