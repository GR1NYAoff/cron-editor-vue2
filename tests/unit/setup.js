import Vue from "vue";

// Element UI components aren't registered in the unit-test environment;
// silence the resulting "unknown custom element" warnings since these tests
// only assert on component state, not on ElementUI's own rendering.
Vue.config.ignoredElements = [/^el-/];
