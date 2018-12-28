<template>
  <main :key="input.class">
    <span :class="input.class">
      <markdown
        v-if="Array.isArray(input.value)"
        v-for="child in input.value"
        :key="child.class"
        :input="child"
      ></markdown>
      <span v-if="!Array.isArray(input.value) && input.class === 'text'">{{input.value}}</span>
    </span>
  </main>
</template>

<script>
export default {
  props: ["input"],
  name: "markdown"
};
</script>

<style scoped>
main {
  display: inline;
}
.heading {
  color: #2dba8a;
  font-weight: 900;
  font-size: 40px;
}
.italic {
  font-style: italic;
  color: #e63462;
}
.bold {
  font-weight: 900;
  color: #fe5f55;
}
</style>