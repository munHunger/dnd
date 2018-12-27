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
  font-size: 22px;
}
.italic {
  font-style: italic;
}
.bold {
  font-weight: 900;
}
</style>